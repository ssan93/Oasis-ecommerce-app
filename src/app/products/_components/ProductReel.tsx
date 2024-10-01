"use client";

import { trpc } from "@/server/trpc/client";
import Link from "next/link";
import ProductListing from "./ProductListing";
import { IQueryValidator } from "@/models/query-validator";
import { ITEM_FALLBACK_LIMIT } from "@/models/constants";

interface ProductReelProps {
  title: string;
  subtitle?: string;
  href?: string;
  query: IQueryValidator;
}

const useQuery = (query: IQueryValidator) => {
  const { category, tags } = query;
  if (category) {
    const { data: categoryId } = trpc.product.getCategoryId.useQuery({
      category,
    });
    query = { ...query, category: categoryId };
  }
  if (tags) query = { ...query, tags };

  return trpc.product.getProducts.useQuery({ query });
};

const ProductReel = ({ title, subtitle, href, query }: ProductReelProps) => {
  const { data: products, isError } = useQuery(query);

  const map =
    products || new Array<null>(query.limit ?? ITEM_FALLBACK_LIMIT).fill(null);

  return (
    <section className="py-12">
      <div className="mb-4 md:flex md:items-center md:justify-between">
        <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          {title ? (
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>

        {href ? (
          <Link
            href={href}
            className="hidden text-sm font-medium text-blue-600 hover:text-blue-500 md:block"
          >
            Shop the collection <span aria-hidden="true">&rarr;</span>
          </Link>
        ) : null}
      </div>

      <div className="relative">
        <div className="mt-6 flex w-full items-center">
          <div className="grid w-full grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
            {isError ? (
              <div className="text-center">Error loading products</div>
            ) : (
              map.map((product, i) => (
                <ProductListing
                  key={`product-${i}`}
                  product={product}
                  index={i}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductReel;
