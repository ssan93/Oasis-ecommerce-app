"use client";
import { getNestedField } from "@/lib/payload-utils";
import Image from "next/image";
// import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/formatters";
// import { getPayloadClient } from "@/server/payload/get-payload";
import { Product, User } from "@/server/payload/payload-types";
import PaymentStatus from "./_components/PaymentStatus";
import { trpc } from "@/server/trpc/client";
import { XCircle } from "lucide-react";
import { TRANSACTION_FEE } from "@/models/constants";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const ThankYouPage = ({ searchParams }: PageProps) => {
  const orderId =
    typeof searchParams.orderId === "string" ? searchParams.orderId : null;
  // const nextCookies = cookies();

  // const { user } = await getServerSideUser(nextCookies);

  if (!orderId) {
    return notFound();
  }
  const {
    data: order,
    isError,
    isLoading,
  } = trpc.payment.getOrder.useQuery({ orderId });

  if (isError) return notFound();

  if (!order || isLoading) return <div>Loading...</div>;

  const orderUserId = getNestedField(order.user, "id");
  // typeof order.user === "string" ? order.user : order.user.id;

  // if (orderUserId !== user?.id) {
  //   return redirect(`/sign-in?origin=thank-you?orderId=${order.id}`);
  // }

  const productsQuantities = order.products_quantities.map(
    ({ product, quantity }) => ({
      product: product as Product,
      quantity,
    }),
  );

  const orderTotal = productsQuantities.reduce(
    (total, { product, quantity }) => {
      return total + product.price * quantity;
    },
    0,
  );

  return (
    <main className="relative lg:min-h-full">
      <div className="hidden h-80 overflow-hidden lg:absolute lg:mt-32 lg:block lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <Image
          fill
          src="/checkout-thanks.jpg"
          sizes="(min-width: 1536px) 50vw, 100vw"
          objectFit="contain"
          alt="thank you for your order"
        />
      </div>

      <div>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
          <div className="lg:col-start-2">
            <p className="text-sm font-medium text-blue-600">
              Order successful
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Thank you for ordering
            </h1>
            {order._isPaid ? (
              <p className="mt-2 text-base text-muted-foreground">
                Your order was processed and your assets are available to
                download below. We&apos;ve sent your receipt and order details
                to{" "}
                {typeof order.user !== "string" ? (
                  <span className="font-medium text-gray-900">
                    {order.user.email}
                  </span>
                ) : null}
                .
              </p>
            ) : (
              <p className="mt-2 text-base text-muted-foreground">
                We appreciate your order, and we&apos;re currently processing
                it. So hang tight and we&apos;ll send you confirmation very
                soon!
              </p>
            )}

            <div className="mt-16 text-sm font-medium">
              <div className="text-muted-foreground">Order nr.</div>
              <div className="mt-2 text-gray-900">{order.id}</div>

              <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
                {productsQuantities.map(({ product, quantity }) => {
                  const category = getNestedField(product.category, "name");

                  // const downloadUrl = (
                  //   product.product_files as ProductFile
                  // ).url as string

                  const { image } = product.images?.[0] ?? {};

                  return (
                    <li key={product.id} className="flex space-x-6 py-6">
                      <div className="relative h-24 w-24">
                        {typeof image !== "string" && image?.url ? (
                          <Image
                            fill
                            src={image.url}
                            alt={`${product.name} image`}
                            className="flex-none rounded-md bg-gray-100 object-cover object-center"
                          />
                        ) : null}
                      </div>

                      <div className="flex flex-auto flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="text-gray-900">{product.name}</h3>

                          <p className="my-1">Category: {category}</p>
                          <p className="text-gray-600">Quantity: {quantity}</p>
                        </div>

                        {order._isPaid ? (
                          <a
                            href="#"
                            download={product.name}
                            className="text-blue-600 underline-offset-2 hover:underline"
                          >
                            Download asset
                          </a>
                        ) : null}
                      </div>
                      <div className="flex flex-col items-end">
                        {/* <p className="flex-none text-gray-600">
                          {formatPrice(product.price)}
                        </p> */}
                        <p className="flex-none font-medium text-gray-900">
                          {formatPrice(product.price * quantity)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p className="text-gray-900">{formatPrice(orderTotal)}</p>
                </div>

                <div className="flex justify-between">
                  <p>Transaction Fee</p>
                  <p className="text-gray-900">
                    {formatPrice(TRANSACTION_FEE)}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                  <p className="text-base">Total</p>
                  <p className="text-base">
                    {formatPrice(orderTotal + TRANSACTION_FEE)}
                  </p>
                </div>
              </div>

              <PaymentStatus
                isPaid={order._isPaid}
                orderEmail={(order.user as User).email}
                orderId={order.id}
              />

              <div className="mt-16 border-t border-gray-200 py-6 text-right">
                <Link
                  href="/products"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Continue shopping &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThankYouPage;
