/* eslint-disable @typescript-eslint/no-explicit-any */

import { getServerSession } from "next-auth";
import { api } from "@/src/config/api.config";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);


    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No access token" },
        { status: 401 }
      );
    }

    const res = await api.get("/cart", {
      headers: {
        "Content-Type": "application/json",
        token: session.accessToken, 
      },
    });


    return NextResponse.json(res.data, { status: 200 });
    
  } catch (error: any) {
 

    if (error.response?.status === 401) {
      return NextResponse.json(
        { success: false, message: "Session expired" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}