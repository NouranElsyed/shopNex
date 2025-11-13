/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth";
import { api } from "@/src/config/api.config";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const res = await api.get("/addresses", {
      headers: { token: session.accessToken },
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const res = await api.post("/addresses", body, {
      headers: { token: session.accessToken },
    });


    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to add address" },
      { status: 500 }
    );
  }
}
