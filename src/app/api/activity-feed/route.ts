import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authCheck = requireAuth(req);
  if (!authCheck.success) {
    return authCheck.response;
  }

  try {
    const { db } = await mongoConnect();

    const recentShelves = await db
      .collection("user_shelves")
      .find()
      .sort({ dateAdded: -1 })
      .limit(20)
      .toArray();

    const recentReviews = await db
      .collection("reviews")
      .find({ status: "Approved" })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    const allUserIds = [
      ...new Set([
        ...recentShelves.map((s) => s.userId),
        ...recentReviews.map((r) => r.userId),
      ]),
    ];

    const allBookIds = [
      ...new Set([
        ...recentShelves.map((s) => s.bookId),
        ...recentReviews.map((r) => r.bookId),
      ]),
    ];

    const users = await db
      .collection("users")
      .find({ _id: { $in: allUserIds.map((id) => new ObjectId(id)) } })
      .toArray();

    const books = await db
      .collection("books")
      .find({
        _id: {
          $in: allBookIds.map((id) =>
            typeof id === "string" ? new ObjectId(id) : id
          ),
        },
      })
      .toArray();

    const userMap = new Map(users.map((u) => [u._id.toString(), u.name]));
    const bookMap = new Map(books.map((b) => [b._id.toString(), b.title]));

    const activities = [];

    recentShelves.forEach((shelf) => {
      const userName = userMap.get(shelf.userId) || "Unknown User";
      const bookTitle = bookMap.get(shelf.bookId) || "Unknown Book";

      if (shelf.shelf === "Read" && shelf.dateFinished) {
        activities.push({
          type: "finished",
          userName,
          bookTitle,
          bookId: shelf.bookId,
          timestamp: shelf.dateFinished,
          message: `${userName} finished reading ${bookTitle}`,
        });
      } else if (shelf.dateAdded) {
        activities.push({
          type: "added",
          userName,
          bookTitle,
          bookId: shelf.bookId,
          shelf: shelf.shelf,
          timestamp: shelf.dateAdded,
          message: `${userName} added ${bookTitle} to ${shelf.shelf} shelf`,
        });
      }
    });

    recentReviews.forEach((review) => {
      const userName = userMap.get(review.userId) || "Unknown User";
      const bookTitle = bookMap.get(review.bookId) || "Unknown Book";

      if (review.createdAt) {
        activities.push({
          type: "rated",
          userName,
          bookTitle,
          bookId: review.bookId,
          rating: review.rating,
          timestamp: review.createdAt,
          message: `${userName} rated ${bookTitle} ${review.rating} stars`,
        });
      }
    });

    activities.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const limitedActivities = activities.slice(0, 5);

    return NextResponse.json(limitedActivities);
  } catch (error) {
    console.error("Activity feed API error:", error);
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
