import { router } from "../trpc/trpc";
import { authRouter } from "./auth-router";
import { paymentRouter } from "./payment-router";
import { productRouter } from "./product-router";

export const appRouter = router({
  auth: authRouter,
  product: productRouter,
  payment: paymentRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
