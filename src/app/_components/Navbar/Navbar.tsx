import MaxWidthWrapper from "../MaxWidthWrapper";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/app/_components/ui";
import { Cart } from "../Cart/Cart";
import { getServerSideUser } from "@/lib/payload-utils";
import { cookies } from "next/headers";
import UserAccountNav from "./UserAccountNav";
import { NavItem } from "./NavItem";

const navItems = [
  // {
  //   label: "Home",
  //   href: "/",
  // },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Orders",
    href: "/orders",
  },
];

export const Navbar = async () => {
  const nextCookies = cookies();
  const { user } = await getServerSideUser(nextCookies);
  return (
    <div className="sticky inset-x-0 top-0 z-50 h-16 bg-white">
      <header className="relative">
        <div className="border-b border-gray-200">
          <MaxWidthWrapper className="flex h-16 items-center">
            <div className="ml-4 lg:ml-0">
              <Link href="/">
                <Image
                  src="/logo-7web.png"
                  alt="WedStream Logo"
                  width={50}
                  height={50}
                />
              </Link>
            </div>

            <div className="ml-6">
              {navItems.map((item) => (
                <NavItem key={item.label} item={item} />
              ))}
            </div>

            <div className="ml-auto flex items-center">
              <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                {user ? null : (
                  <Link
                    href="/sign-in"
                    className={buttonVariants({
                      variant: "ghost",
                    })}
                  >
                    Sign in
                  </Link>
                )}

                {user ? null : (
                  <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                )}

                {user ? (
                  <UserAccountNav user={user} />
                ) : (
                  <Link
                    href="/sign-up"
                    className={buttonVariants({
                      variant: "ghost",
                    })}
                  >
                    Create account
                  </Link>
                )}

                {user ? (
                  <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                ) : null}

                {user ? null : (
                  <div className="flex lg:ml-6">
                    <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                  </div>
                )}

                <div className="ml-4 flow-root lg:ml-6">
                  <Cart />
                </div>
              </div>
            </div>
          </MaxWidthWrapper>
        </div>
      </header>
    </div>
  );
};
