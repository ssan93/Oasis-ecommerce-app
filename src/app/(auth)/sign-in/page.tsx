"use client";
import { buttonVariants } from "@/app/_components/ui";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SignInForm } from "../_components/SignInForm";
import { trpc } from "@/server/trpc/client";
import { IAuthCredentials } from "@/models";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { mutate: signIn } = trpc.auth.signIn.useMutation({
    onSuccess: async () => {
      toast.success("Signed in successfully'");

      const redirectUrl = origin ? `/${origin}` : "/";
      router.push(redirectUrl);
      router.refresh();
    },
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        toast.error("Invalid email or password.");

        return;
      }

      if (err instanceof ZodError) {
        toast.error(err.issues[0].message);

        return;
      }

      toast.error("Something went wrong. Please try again.");
    },
  });

  const onSubmit = ({ email, password }: IAuthCredentials) => {
    signIn({ email, password });
  };

  return (
    <>
      <div className="mx-auto w-full space-y-6 px-10 pt-20 sm:w-[400px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Image src="/logo-7web.png" width={50} height={50} alt="logo" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>

          <Link
            className={buttonVariants({
              variant: "link",
              className: "gap-1.5",
            })}
            href="/sign-in"
          >
            Already have an account? Log-in
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <SignInForm onSubmit={onSubmit} />
      </div>
    </>
  );
}
