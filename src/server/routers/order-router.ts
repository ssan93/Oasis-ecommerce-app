import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getPayloadClient } from "../payload/get-payload";
import { Order } from "../payload/payload-types";
import { privateProcedure, router } from "../trpc/trpc";

export const orderRouter = router({
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
  getOrders: privateProcedure.query(async ({ ctx }) => {
    const { user } = ctx;
    const payload = await getPayloadClient();

    const { docs: orders } = await payload.find({
      collection: "orders",
      where: {
        user: {
          equals: user.id,
        },
      },
    });

    return orders as unknown as Order[];
  }),
});
