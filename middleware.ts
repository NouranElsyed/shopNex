import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("Token")?.value;
  console.log(token)
  const { pathname } = req.nextUrl;
  if (token && ["/login", "/signup"].includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/login", "/signup"],
};
