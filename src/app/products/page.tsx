"use client";
import { trpc } from "@/server/trpc/client";
// import MaxWidthWrapper from "../_components/MaxWidthWrapper";
import ProductListing from "./_components/ProductListing";
import MaxWidthWrapper from "../_components/MaxWidthWrapper";
import ProductReel from "./_components/ProductReel";

interface ProductsPageProps {
  searchParams: { [key: string]: string };
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const sort = searchParams.sort;
  const category = searchParams.category;

  return (
    <MaxWidthWrapper>
      <ProductReel
        title={category ?? "Browse high-quality assets"}
        query={{
          category,
          limit: 40,
          sort: sort === "desc" || sort === "asc" ? sort : undefined,
        }}
      />
    </MaxWidthWrapper>
  );
}
