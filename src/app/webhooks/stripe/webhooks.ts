import express from "express";
import type Stripe from "stripe";
import { ReceiptEmailHtml } from "../../_components/emails/ReceiptEmail";
import { WebhookRequest } from "../../../server/server";
import { stripe } from "../../../lib/stripe";
import { Resend } from "resend";
import { getPayloadClient } from "../../../server/payload/get-payload";

const resend = new Resend(process.env.RESEND_API_KEY);

export const stripeWebhookHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const webhookRequest = req as any as WebhookRequest;
  const body = webhookRequest.rawBody;
  const signature = req.headers["stripe-signature"] || "";

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || "",
    );
  } catch (err) {
    return res
      .status(400)
      .send(
        `Webhook Error: ${
          err instanceof Error ? err.message : "Unknown Error"
        }`,
      );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (!session?.metadata?.userId || !session?.metadata?.orderId) {
    return res.status(400).send(`Webhook Error: No user present in metadata`);
  }

  if (event.type === "checkout.session.completed") {
    const payload = await getPayloadClient();

    const { docs: users } = await payload.find({
      collection: "users",
      where: {
        id: {
          equals: session.metadata.userId,
        },
      },
    });

    const [user] = users;

    if (!user) return res.status(404).json({ error: "No such user exists." });

    const { docs: orders } = await payload.find({
      collection: "orders",
      depth: 2,
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    });

    const [order] = orders;

    if (!order) return res.status(404).json({ error: "No such order exists." });

    await payload.update({
      collection: "orders",
      data: {
        _isPaid: true,
      },
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    });

    // const products_quantities = order.products_quantities.map(
    //   ({ product, quantity }) => {
    //     return { product: product as Product, quantity };
    //   },
    // );
    // send receipt
    try {
      const data = await resend.emails.send({
        from: "Oasis Coffee <hello@7webConsulting.com>",
        to: [user.email as string],
        subject: "Thanks for your order! This is your receipt.",
        react: ReceiptEmailHtml({
          date: new Date(),
          email: user.email as string,
          orderId: session.metadata.orderId,
          order,
        }),
      });
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  return res.status(200).send();
};
