import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="flex-grow-0 bg-white">
      <MaxWidthWrapper>
        <div className="py-10 md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} All Rights Reserved
            </p>
          </div>
          <div className="p-8">
            <div className="flex justify-center">
              <Image
                src="/logo-7web.png"
                alt="7Web Logo"
                width={50}
                height={50}
              />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center md:mt-0">
            <div className="flex space-x-8">
              <Link
                href="/admin"
                className="text-sm text-muted-foreground hover:text-gray-600"
              >
                Admin
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-gray-600"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-gray-600"
              >
                Privacy Policy
              </Link>
              {/* <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-gray-600"
              >
                Cookie Policy
              </Link> */}
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
};
