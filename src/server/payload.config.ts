import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { webpackBundler } from "@payloadcms/bundler-webpack"; // To use admin panel
import { slateEditor } from "@payloadcms/richtext-slate";
import { buildConfig } from "payload/config";
import path from "path";
import {
  Admins,
  Categories,
  Medias,
  Orders,
  Products,
  Users,
} from "./payload/collections";
import dotenv from "dotenv";

dotenv.config({ path: [".env.local", ".env"] });

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
  cookiePrefix:
    process.env.NODE_ENV === "production" ? "payload-prod" : "payload-dev",
  collections: [Admins, Users, Products, Categories, Medias, Orders],
  admin: {
    user: "admins",
    bundler: webpackBundler(),
    meta: {
      titleSuffix: " | Payload",
      favicon: "/logo-7web-white.png",
      ogImage: "/logo-7web.png",
    },
  },
  routes: {
    admin: "/admin",
  },
  rateLimit: {
    // By default, the rate is 500
    max: 2000,
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI!,
  }),
  typescript: {
    outputFile: path.resolve(__dirname, "payload/payload-types.ts"),
  },
});
