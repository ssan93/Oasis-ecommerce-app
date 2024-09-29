import express from "express";
import dotenv from "dotenv";
import { nextApp, nextHandler } from "../next-utils";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { getPayloadClient } from "./payload/get-payload";
import nextBuild from "next/dist/build";
import { IncomingMessage } from "http";
import { stripeWebhookHandler } from "../app/webhooks/stripe/webhooks";
import bodyParser from "body-parser";
import path from "path";

dotenv.config({ path: [".env.local", ".env"] });

const app = express();
const PORT = process.env.PORT || 3000;
const PAYLOAD_SECRET = process.env.PAYLOAD_SECRET;

if (!PAYLOAD_SECRET) {
  throw new Error("Payload secret is not defined");
}

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

export type ExpressContext = Awaited<ReturnType<typeof createContext>>;

export type WebhookRequest = IncomingMessage & {
  rawBody: Buffer;
};

const start = async () => {
  const webhookMiddleware = bodyParser.json({
    verify: (req: WebhookRequest, _, buffer) => {
      req.rawBody = buffer;
    },
  });

  app.post("/api/webhooks/stripe", webhookMiddleware, stripeWebhookHandler);

  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Payload Admin URL: ${cms.getAdminURL()}`);
      },
    },
  });

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info(`Next.js is now building...`);
      // @ts-expect-error - nextBuild is not typed
      await nextBuild(path.join(__dirname, "../../"));
      process.exit();
    });

    return;
  }

  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  // app.use("/admin", async (req, res, next) => {
  //   const payload_user = await validateAccess(req);
  //   if (payload_user) {
  //     if (payload_user.user_type === "admins") {
  //       next();
  //     } else {
  //       res.redirect("../");
  //     }
  //   } else {
  //     next();
  //   }
  // });

  app.use((req, res) => {
    nextHandler(req, res);
  });

  nextApp
    .prepare()
    .then(() => {
      payload.logger.info(`Next.js app prepared`);

      app.listen(PORT, async () => {
        payload.logger.info(
          `Next.js App URL : ${process.env.NEXT_PUBLIC_SERVER_URL}`,
        );
      });
    })
    .catch((err) => {
      payload.logger.error(`Error starting Next.js app: ${err}`);
    });
};

start();
