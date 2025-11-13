/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth";
import { api } from "@/src/config/api.config";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { cartId, shippingAddress, returnUrl } = await request.json();

    const res = await api.post(
      `/orders/checkout-session/${cartId}?url=${encodeURIComponent(returnUrl)}`,
      { shippingAddress },
      { headers: { token: session.accessToken } }
    );
console.log("postcheeesckout================>: ",res.data)

if(res.data.status==="success"){
 await api.delete("/cart",{
       headers:{
        "Content-Type": "application/json",
        token:  session.accessToken,
       }
    })
}
    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message || "Checkout failed" },
      { status: 500 }
    );
  }
}