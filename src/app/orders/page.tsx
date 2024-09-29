import React from "react";
import { Metadata } from "next";
import Link from "next/link";
// import { notFound } from "next/navigation";
// import { getServerSideUser } from "@/lib/payload-utils";
// import { cookies } from "next/headers";
import { Order } from "@/server/payload/payload-types";
import { buttonVariants } from "../_components/ui";

export default async function Orders() {
  // const nextCookies = cookies();
  // const { user } = await getServerSideUser(nextCookies);

  const orders: Order[] | null = [];

  return (
    <div>
      <h1>Orders</h1>
      {/* {(!orders || !Array.isArray(orders) || orders?.length === 0) && (
        <p className={classes.noOrders}>You have no orders.</p>
      )} */}
      {orders && orders.length > 0 && (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <Link href={`/orders/${order.id}`}>{order.id}</Link>
            </li>
          ))}
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
    </div>
  );
}

export const metadata: Metadata = {
  title: "Orders",
  description: "Your orders.",
};
