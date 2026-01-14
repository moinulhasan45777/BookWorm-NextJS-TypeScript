import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { db } = await mongoConnect();
    const newReview = await req.json();

    // Check if user already submitted a review for this book
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

    await db.collection("reviews").insertOne(newReview);

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
