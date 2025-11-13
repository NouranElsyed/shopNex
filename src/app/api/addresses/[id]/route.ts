/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth";
import { api } from "@/src/config/api.config";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      console.warn("❌ No access token found in session");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    console.log("🧨 Deleting address:", id);

    const res = await api.delete(`/addresses/${id}`, {
      headers: { token: session.accessToken },
      validateStatus: () => true,
    });

    console.log("📡 Backend DELETE status:", res.status);
    console.log("📨 Backend response data:", res.data);

    if (res.status >= 200 && res.status < 300) {
      console.log("✅ Address deleted successfully from backend");
      return NextResponse.json({ success: true }, { status: 200 });
    }

    console.error("❌ Backend failed to delete:", res.status, res.data);
    return NextResponse.json(
      { message: "Failed to delete address", details: res.data },
      { status: res.status || 500 }
    );
  } catch (error: any) {
    console.error("🔥 Error in DELETE /api/addresses/[id]:", error.message);
    return NextResponse.json(
      { message: "Failed to delete address", error: error.message },
      { status: 500 }
    );
  }
}
