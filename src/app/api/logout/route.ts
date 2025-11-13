// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST() {
  try {
  
    const session = await getServerSession(authOptions);
    
    console.log("🚪 Logging out user:", session?.user?.email);

    const response = NextResponse.json({ 
      success: true, 
      message: "Logged out successfully" 
    });


    response.cookies.delete("__next_hmr_refresh_hash__");
    response.cookies.delete("next-auth.csrf-token");
    response.cookies.delete("next-auth.callback-url");
    response.cookies.delete("next-auth.session-token");


    console.log("✅ All auth cookies deleted");

    return response;

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Logout failed" },
      { status: 500 }
    );
  }
}