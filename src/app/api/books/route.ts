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
    const res = await db.collection("books").find().toArray();

    return NextResponse.json(res);
  } catch {
    return NextResponse.json(
      {
        error: "Something went wrong!",
      },
      {
        status: 404,
      }
    );
  }
}
