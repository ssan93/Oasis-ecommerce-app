import { NextRequest, NextResponse } from "next/server";
import { getServerSideUser } from "./lib/payload-utils";

const protectedRoutes = ["/orders", "/account", "/cart"];

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;

  const { user } = await getServerSideUser(cookies);

  if (!user && protectedRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/sign-in?origin=${nextUrl.pathname.slice(1)}`,
    );
  }

  if (user && ["/sign-in", "/sign-up"].includes(nextUrl.pathname)) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/`);
  }

  return NextResponse.next();
}
