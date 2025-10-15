import { api } from "@/config/api.config";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { productId } = await req.json();
  const cookieStore = await cookies()
  const token = cookieStore.get("Token")?.value;
// console.log(productId,token)
  if (!token) return new Response("Unauthorized", { status: 401 });

  try {
    const res = await api.post(
      "/wishlist",
      { productId },
      {
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      }
    );
console.log(res)
    return NextResponse.json(res.data,
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
