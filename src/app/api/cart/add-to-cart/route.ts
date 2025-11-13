
import { api } from "@/src/config/api.config";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();


 const session = await getServerSession(authOptions);


    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No access token" },
        { status: 401 }
      );
    }
    const res = await api.post(
      "/cart",
      { productId },
      {
        headers: {
          "Content-Type": "application/json",
          token: session.accessToken,
        },
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Product added to cart successfully",
        data: res.data,
      },
      { status: 200 }
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.response?.data?.message || "Something went wrong",
      },
      { status: error?.response?.status || 500 }
    );
  }
}
