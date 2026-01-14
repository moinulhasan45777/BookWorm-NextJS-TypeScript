import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authCheck = requireAuth(req);
  if (!authCheck.success) {
    return authCheck.response;
  }

  const { db } = await mongoConnect();
  const genres = await db.collection("genres").countDocuments();
  return NextResponse.json(genres);
}
