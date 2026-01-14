import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authCheck = requireAdmin(req);
  if (!authCheck.success) {
    return authCheck.response;
  }

  const { db } = await mongoConnect();
  const users = await db.collection("users").countDocuments();
  return NextResponse.json(users);
}
