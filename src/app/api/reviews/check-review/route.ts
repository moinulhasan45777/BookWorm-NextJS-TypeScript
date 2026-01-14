import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authCheck = requireAuth(request);
  if (!authCheck.success) {
    return authCheck.response;
  }

  try {
    const { db } = await mongoConnect();
    const searchParams = request.nextUrl.searchParams;

    const bookId = searchParams.get("bookId");
    const userId = searchParams.get("userId");

    if (!bookId || !userId) {
      return NextResponse.json(
        {
          error: "Missing bookId or userId",
        },
        {
          status: 400,
        }
      );
    }

    const existingReview = await db.collection("reviews").findOne({
      bookId,
      userId,
    });

    return NextResponse.json({
      hasReviewed: !!existingReview,
    });
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
