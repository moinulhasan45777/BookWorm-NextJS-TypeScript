import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const authCheck = requireAuth(req);
  if (!authCheck.success) {
    return authCheck.response;
  }

  try {
    const { db } = await mongoConnect();
    const newReview = await req.json();

    const existingReview = await db.collection("reviews").findOne({
      bookId: newReview.bookId,
      userId: newReview.userId,
    });

    if (existingReview) {
      return NextResponse.json(
        {
          error: "You have already submitted a review for this book.",
        },
        {
          status: 409,
        }
      );
    }

    await db.collection("reviews").insertOne({
      ...newReview,
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        success: "Added Successfully!",
      },
      {
        status: 200,
      }
    );
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
