import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = requireAuth(request);
  if (!authCheck.success) {
    return authCheck.response;
  }

  try {
    const { db } = await mongoConnect();
    const { id } = await params;

    const reviews = await db
      .collection("reviews")
      .find({ bookId: id, status: "Approved" })
      .toArray();

    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json(
      {
        error: "Something went wrong!",
      },
      {
        status: 500,
      }
    );
  }
}
