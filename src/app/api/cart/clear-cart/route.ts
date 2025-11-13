
import { api } from "@/src/config/api.config";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function DELETE(){
 const session = await getServerSession(authOptions);
    


    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No access token" },
        { status: 401 }
      );
    }

try {
    const res = await api.delete("/cart",{
       headers:{
        "Content-Type": "application/json",
        token:  session.accessToken,
       }
    })
    console.log(res)
    return NextResponse.json({success:true, data:res.data, message: "cart cleared" })
} catch (error) {
   
        return NextResponse.json(
          { success: false, message: error },
          { status: 500 }
        );
}
};