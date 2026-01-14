import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authCheck = requireAuth(req);
  if (!authCheck.success) {
    return authCheck.response;
  }

  try {
    const { db } = await mongoConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    const user = await db.collection("users").findOne({ email });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}
