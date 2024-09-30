"use client";
import React from "react";
import Link from "next/link";
// import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
  buttonVariants,
} from "../_components/ui";
import { trpc } from "@/server/trpc/client";
import { getNestedField } from "@/lib/payload-utils";
import Image from "next/image";
import { formatPrice } from "@/lib/formatters";
import MaxWidthWrapper from "../_components/MaxWidthWrapper";
import { CardHeader } from "../_components/ui";

export default function Orders() {
  const { data: orders, isError, isLoading } = trpc.order.getOrders.useQuery();

  if (isError) {
    return <div>Failed to load orders.</div>;
  }

  if (isLoading || !orders) {
    return <div>Loading...</div>;
  }

  return (
    <MaxWidthWrapper className="space-y-6 py-10">
      <h1 className="text-3xl font-semibold">My Orders</h1>
      {(!orders || !Array.isArray(orders) || orders?.length === 0) && (
        <p className="text-sm text-muted-foreground">You have no orders.</p>
      )}
      {orders && orders.length > 0 && (
        <ul className="space-y-6">
          {orders.map((order) => {
            const subTotal = order.products_quantities.reduce(
              (total, { product, quantity }) =>
                total +
                (typeof product === "string" ? 0 : product.price * quantity),
              0,
            );
            return (
              <Card key={order.id} className="space-y-6">
                <CardHeader>
                  <CardTitle>Order {order.id}</CardTitle>
                  <CardDescription>
                    <div className="text-gray-600">
                      {order.products_quantities.length} items
                    </div>
                    <div className="text-gray-600">
                      {formatPrice(subTotal)} total
                    </div>

                    <div className="text-gray-600">
                      {order._isPaid ? "Paid" : "Unpaid"}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul>
                    {order.products_quantities.map(({ product, quantity }) => {
                      if (typeof product === "string") {
                        return null;
                      }
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
                              <p className="text-gray-600">
                                Quantity: {quantity}
                              </p>
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
                            <p className="flex-none font-medium text-gray-900">
                              {formatPrice(product.price * quantity)}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
                <CardFooter>
                  <div className="w-full space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground">
                    <div className="flex justify-between">
                      <p>Subtotal</p>
                      <p className="text-gray-900">{formatPrice(subTotal)}</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </ul>
      )}
      <Link
        href="/"
        className={buttonVariants({
          variant: "ghost",
        })}
      >
        Back to home
      </Link>
    </MaxWidthWrapper>
  );
}
