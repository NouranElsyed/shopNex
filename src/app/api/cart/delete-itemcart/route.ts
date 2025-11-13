
import { api } from "@/src/config/api.config";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function DELETE(req:Request){
 const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No access token" },
        { status: 401 }
      );
    }

const {productId} = await req.json()

try {
    const res = await api.delete(`/cart/${productId}`,{headers:{token:session.accessToken,}})
    console.log(res)
    return NextResponse.json({success:true,message:"item deleted successfully"},{status:200})
} catch (error) {
    console.log(error)
     return NextResponse.json({success:false,error:error},{status:400})
}
}