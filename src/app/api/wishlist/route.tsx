/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { api } from "@/src/config/api.config";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
const session = await getServerSession(authOptions);
    


    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No access token" },
        { status: 401 }
      );
    }

  console.log("Wishlist Token:", session.accessToken); 

  if (! session.accessToken) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const res = await api.get("/wishlist", {
      headers: { token: session.accessToken },
    });
    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}