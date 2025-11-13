/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/src/config/api.config";
import { AxiosError } from "axios";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(req: Request) {
  try {
    const { productId, count } = await req.json();
 const session = await getServerSession(authOptions);
    


    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No access token" },
        { status: 401 }
      );
    }

    if (count < 1) {
      return NextResponse.json(
        { success: false, message: "Count must be at least 1" },
        { status: 400 }
      );
    }

    const res = await api.put(
      `/cart/${productId}`,
      { count },
      {
        headers: {
          "Content-Type": "application/json",
          token:session.accessToken,
        },
      }
    );

    return NextResponse.json(res.data);
  } catch (error) {
    const err = error as AxiosError<any>;
    return NextResponse.json(
      {
        success: false,
        message: err.response?.data?.message || "Update failed",
      },
      { status: err.response?.status || 500 }
    );
  }
}
