import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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
