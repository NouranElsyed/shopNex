/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/src/config/api.config";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function DELETE(request: Request) {
 const session = await getServerSession(authOptions);
    

    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No access token" },
        { status: 401 }
      );
    }

  const { productId } = await request.json();

  if (!session.accessToken || !productId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized or missing product" },
      { status: 401 }
    );
  }

  try {
    const res = await api.delete(`/wishlist/${productId}`, {
      headers: { token:session.accessToken },
    });
    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to remove" },
      { status: 500 }
    );
  }
}