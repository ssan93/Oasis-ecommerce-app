"use client";

import Link from "next/link";
import { buttonVariants } from "../ui";
import { usePathname } from "next/navigation";

interface NavItemProps {
  item: {
    label: string;
    href: string;
  };
}
export const NavItem = ({ item }: NavItemProps) => {
  const isActive = usePathname() === item.href;
  return (
    <Link
      href={item.href}
      className={buttonVariants({
        variant: isActive ? "secondary" : "ghost",
      })}
    >
      {item.label}
    </Link>
  );
};
