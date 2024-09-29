import { z } from "zod";
import { getPayloadClient } from "../payload/get-payload";
import { privateProcedure, router } from "../trpc/trpc";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { stripe } from "../../lib/stripe";
import { Order } from "../payload/payload-types";

export const paymentRouter = router({
  createSession: privateProcedure
    .input(
      z.object({
        cart: z.array(z.object({ id: z.string(), quantity: z.number() })),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { cart } = input;

      if (cart.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const payload = await getPayloadClient();

      const productIds = cart.map((prod) => prod.id);
      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          id: {
            in: productIds,
          },
        },
      });

      // Filter out products with no price
      const filteredProducts = products
        .filter((prod) => Boolean(prod.price))
        .map((prod) => {
          const quantity = cart.find((item) => item.id === prod.id)?.quantity;
          return { product: prod, quantity: quantity ?? 0 };
        });
      // Create order
      const order = await payload.create({
        collection: "orders",
        data: {
          _isPaid: false,
          products_quantities: filteredProducts.map(
            ({ product, quantity }) => ({
              product: product.id as string,
              quantity,
            }),
          ),
          user: user.id,
        },
      });

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      filteredProducts.forEach(({ product, quantity }) => {
        line_items.push({
          price: product.priceId! as string,
          quantity: quantity,
        });
      });

      line_items.push({
        price: "price_1Q3yGyRrnhd0YWOj6qLNgzdK",
        quantity: 1,
        adjustable_quantity: {
          enabled: false,
        },
      });

      try {
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          payment_method_types: ["card"],
          mode: "payment",
          metadata: {
            userId: user.id,
            orderId: order.id,
          },
          line_items,
        });

        return { url: stripeSession.url };
      } catch (err) {
        console.log(err);
        return { url: null };
      }
    }),
  getOrder: privateProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      const { orderId } = input;

      const payload = await getPayloadClient();

      const order = await payload.findByID({
        collection: "orders",
        id: orderId,
      });

      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return order as unknown as Order;
    }),
  pollOrderStatus: privateProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      const { orderId } = input;

      const payload = await getPayloadClient();

      const { docs: orders } = await payload.find({
        collection: "orders",
        where: {
          id: {
            equals: orderId,
          },
        },
      });

      if (!orders.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const [order] = orders;

      return { isPaid: order._isPaid };
    }),
});
