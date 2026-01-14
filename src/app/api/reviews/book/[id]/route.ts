import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

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

    // Get unique user IDs from reviews
    const userIds = [...new Set(reviews.map((r) => r.userId))];

    // Fetch user data for all reviewers
    const users = await db
      .collection("users")
      .find({ _id: { $in: userIds.map((id) => new ObjectId(id)) } })
      .project({ password: 0 }) // Exclude password
      .toArray();

    // Create a map of userId to user data
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    // Attach user data to each review
    const reviewsWithUsers = reviews.map((review) => ({
      ...review,
      user: userMap.get(review.userId) || null,
    }));

    return NextResponse.json(reviewsWithUsers);
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
