"use client";
import { buttonVariants } from "@/app/_components/ui";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SignUpForm } from "../_components/SignUpForm";
import { trpc } from "@/server/trpc/client";
import { ISignUp } from "@/models";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const { mutate } = trpc.auth.register.useMutation({
    onError: (err) => {
      if (err.data?.code === "CONFLICT") {
        toast.error("This email is already in use. Sign in instead?");

        return;
      }

      if (err instanceof ZodError) {
        toast.error(err.issues[0].message);

        return;
      }

      toast.error("Something went wrong. Please try again.");
    },
    onSuccess: ({ sentToEmail }) => {
      toast.success(`Verification email sent to ${sentToEmail}.`);
      router.push("/verify-email?to=" + sentToEmail);
    },
  });

  const onSubmit = ({ email, password }: ISignUp) => {
    mutate({ email, password });
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
        <SignUpForm onSubmit={onSubmit} />
      </div>
    </>
  );
}
