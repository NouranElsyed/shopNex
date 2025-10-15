import { api } from "@/config/api.config";
import { IAxiosError } from "@/interfaces";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const { productId, count, action } = await req.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("Token")?.value;
  console.log(productId, count, action);

  if (count < 1 || (count == 1 && action === "minus")) return NextResponse.json({success:false,message:"Cannot decrease below 1"});

  if (!token) return new Response("Unauthorized", { status: 401 });

  let newCount = count;
  if (action === "plus") {
    newCount = count + 1;
  }
  if (action === "minus") {
    newCount = count - 1;
  }
  const body = { count: newCount };
  
  try {
    const res = await api.put(`/cart/${productId}`, body, {
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });
    console.log(res);
    return NextResponse.json(res.data, { status: 200 });
  } catch (error) {
    console.log(error);
    const AxiosErr = error as AxiosError<IAxiosError>;
    console.log(AxiosErr?.response);
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
