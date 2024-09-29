"use client";
import MaxWidthWrapper from "@/app/_components/MaxWidthWrapper";
import { trpc } from "@/server/trpc/client";
import { notFound } from "next/navigation";
import { ProductInfo } from "./_components/ProductInfo";
import { Skeleton } from "@/app/_components/ui/skeleton";

interface PageProps {
  params: {
    id: string;
  };
}

const Page = ({ params }: PageProps) => {
  const { id } = params;

  const {
    data: product,
    isError,
    isLoading,
  } = trpc.product.getProduct.useQuery({ id });

  if (isError) return notFound();

  return (
    <MaxWidthWrapper className="bg-white">
      {isLoading ? <ProductPlaceholder /> : <ProductInfo product={product} />}
    </MaxWidthWrapper>
  );
};

const ProductPlaceholder = () => {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
      <div className="lg:max-w-lg lg:self-end">
        <Skeleton className="mt-4 h-4 w-16 rounded-lg" />
        <Skeleton className="mt-4 h-6 w-1/3 rounded-lg" />
        <Skeleton className="mt-4 h-4 w-20 rounded-lg" />
        <Skeleton className="mt-6 h-4 w-1/3 rounded-lg" />
      </div>
      <div className="relative mt-10 aspect-square w-full overflow-hidden rounded-xl bg-zinc-100 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
};
export default Page;
