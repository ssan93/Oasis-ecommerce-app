import { z } from "zod";
import { QueryValidator } from "../../models/query-validator";
import { getPayloadClient } from "../payload/get-payload";
import { publicProcedure, router } from "../trpc/trpc";
import { TRPCError } from "@trpc/server";
import { Product } from "../payload/payload-types";

export const productRouter = router({
  getProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).optional(),
        query: QueryValidator,
      }),
    )
    .query(async ({ input }) => {
      const { query } = input;
      const { sort, limit, ...queryOpts } = query;

      const parsedQueryOpts: Record<string, { equals: string }> = {};

      Object.entries(queryOpts).forEach(([key, value]) => {
        parsedQueryOpts[key] = {
          equals: value,
        };
      });

      const payload = await getPayloadClient();

      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          ...parsedQueryOpts,
        },
        limit,
        sort,
      });

      return products as unknown as Product[];
    }),
  getProductsByCategory: publicProcedure
    .input(
      z.object({
        category: z.string(),
        limit: z.number().min(1).optional(),
      }),
    )
    .query(async ({ input }) => {
      const { category, limit } = input;

      const payload = await getPayloadClient();

      const { docs } = await payload.find({
        collection: "categories",
        where: {
          name: {
            equals: category,
          },
        },
        limit: 1,
      });

      if (docs.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      const categoryId = docs[0].id;

      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          category: {
            equals: categoryId,
          },
        },
        limit,
      });

      return products;
    }),

  getProduct: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;
      const payload = await getPayloadClient();

      const product = await payload.findByID({
        collection: "products",
        id,
      });

      return product as unknown as Product;
    }),
  getCategoryId: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      const { category } = input;
      const payload = await getPayloadClient();

      const { docs } = await payload.find({
        collection: "categories",
        where: {
          name: {
            equals: category,
          },
        },
        limit: 1,
      });
      if (docs.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      return docs[0].id as string;
    }),
});
