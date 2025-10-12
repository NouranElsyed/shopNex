import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token, user } = await req.json();
  const res = NextResponse.json({ success: true });
  res.cookies.set("Token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  res.cookies.set("User", JSON.stringify(user), {
    httpOnly: false,
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return res;
}
