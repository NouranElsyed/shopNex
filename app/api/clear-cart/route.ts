import { api } from "@/config/api.config";
import { IAxiosError } from "@/interfaces";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(req:Request){
const cookieStore = await cookies()
const token = cookieStore.get("Token")?.value

try {
    const res = await api.delete("/cart",{
       headers:{
        "Content-Type": "application/json",
        token: token
       }
    })
    console.log(res)
    return NextResponse.json({success:true, data:res.data, message: "cart cleared" })
} catch (error) {
     const AxiosErr = error as AxiosError<IAxiosError>;
        console.log(AxiosErr?.response);
        return NextResponse.json(
          { success: false, message: error },
          { status: 500 }
        );
}
};