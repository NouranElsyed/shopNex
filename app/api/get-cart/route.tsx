import { api } from "@/config/api.config";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get("Token")?.value;

  if (!token) return new Response("Unauthorized", { status: 401 });

  try {
    const res = await api.get(
      "/cart",
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }  catch (error:any) {
    console.log(error)
    if (error.response?.status === 401) {
      return NextResponse.json(
        { success: false, message: "Session expired" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
