/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { api } from "@/src/config/api.config";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const orderData = {
      shippingAddress: body.shippingAddress,
    };

    const res = await api.post("/orders", orderData, {
      headers: {
        "Content-Type": "application/json",
        token: session.accessToken,
      },
    });

    return NextResponse.json({
      success: true,
      data: res.data,
      message: "Order created successfully"
    });

  } catch (error: any) {

    if (error.response?.status === 401) {
      return NextResponse.json(
        { success: false, message: "Session expired" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || "Failed to create order" 
      },
      { status: error.response?.status || 500 }
    );
  }
}