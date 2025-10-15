import { api } from "@/config/api.config";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(req:Request){
const cookieStore = await cookies()
const token =  cookieStore.get("Token")?.value
const {productId} = await req.json()
if(!token) return NextResponse.json({success:false,message:"Unauthorized"},{status:401})
try {
    const res = await api.delete(`/cart/${productId}`,{headers:{token:token}})
    console.log(res)
    return NextResponse.json({success:true,message:"item deleted successfully"},{status:200})
} catch (error) {
    console.log(error)
     return NextResponse.json({success:false,error:error},{status:400})
}
}