"use client";

import { Product } from "@/server/payload/payload-types";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";
import { Skeleton } from "@/app/_components/ui/skeleton";
import ImageSlider from "./ImageSlider";

interface ProductListingProps {
  product: Product | null;
  index: number;
}

const ProductListing = ({ product, index }: ProductListingProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);

    return () => clearTimeout(timer);
  }, [index]);

  if (!product || !isVisible) return <ProductPlaceholder />;

  const validUrls = product.images
    ?.map(({ image }) => (typeof image === "string" ? image : image?.url))
    .filter(Boolean) as string[];

  if (isVisible && product) {
    return (
      <Link
        className={cn("group/main invisible h-full w-full cursor-pointer", {
          "visible animate-in fade-in-5": isVisible,
        })}
        href={`/products/${product.id}`}
      >
        <div className="flex w-full flex-col">
          <ImageSlider urls={validUrls} />

          <h3 className="mt-4 text-sm font-medium text-gray-700">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{/* {label} */}</p>
          <p className="mt-1 text-sm font-medium text-gray-900">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    );
  }
};

const ProductPlaceholder = () => {
  return (
    <div className="flex w-full flex-col">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100">
        <Skeleton className="h-full w-full" />
      </div>
      <Skeleton className="mt-4 h-4 w-2/3 rounded-lg" />
      <Skeleton className="mt-2 h-4 w-16 rounded-lg" />
      <Skeleton className="mt-2 h-4 w-12 rounded-lg" />
    </div>
  );
};

export default ProductListing;
