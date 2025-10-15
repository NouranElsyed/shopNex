import { NextResponse } from "next/server";

export async function POST(){
    const res = NextResponse.json({ success: true })
    res.cookies.delete("Token")
    res.cookies.delete("User")
    return res;
}