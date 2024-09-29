import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // if ((await isAuthenticated(req)) === false) {
  //   return new NextResponse("Unauthorized", {
  //     status: 401,
  //     headers: { "WWW-Authenticate": "Basic" },
  //   })
  // }
  return NextResponse.next();
}
