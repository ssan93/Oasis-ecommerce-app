import { z } from "zod";
import { publicProcedure, router } from "../trpc/trpc";
import { AuthCredentialsSchema } from "../../models";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../payload/get-payload";

export const authRouter = router({
  register: publicProcedure
    .input(AuthCredentialsSchema)
    .mutation(async ({ input }) => {
      const { email, password } = input;

      const payload = await getPayloadClient();
      // Check if user already exists
      const { docs: user } = await payload.find({
        collection: "users",
        where: {
          email: {
            equals: email,
          },
        },
      });

      if (user.length) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }

      await payload.create({
        collection: "users",
        data: {
          email,
          password, // Hashed automatically
          role: "user",
        },
      });

      return {
        success: true,
        sentToEmail: email,
      };
    }),

  signIn: publicProcedure
    .input(AuthCredentialsSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      // Pass the response object to the payload function to set the cookie
      const { res } = ctx;

      try {
        const payload = await getPayloadClient();

        await payload.login({
          collection: "users",
          data: {
            email,
            password,
          },
          res,
        });
      } catch {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      return {
        success: true,
      };
    }),

  verifyEmail: publicProcedure
    .input(
      z.object({
        token: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { token } = input;
      const payload = await getPayloadClient();

      const isVerified = await payload.verifyEmail({
        collection: "users",
        token,
      });

      if (!isVerified) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid token",
        });
      }

      return {
        success: true,
      };
    }),
  forgotPassword: publicProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { email } = input;
      const payload = await getPayloadClient();

      const token = await payload.forgotPassword({
        collection: "users",
        data: {
          email,
        },
        disableEmail: false,
      });

      return {
        success: true,
        sentToEmail: email,
        token,
      };
    }),
});
