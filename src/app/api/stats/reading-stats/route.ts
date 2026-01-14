import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { db } = await mongoConnect();
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          error: "Missing userId",
        },
        {
          status: 400,
        }
      );
    }

    const shelves = await db
      .collection("user_shelves")
      .find({ userId })
      .toArray();

    const wantToRead = shelves.filter((s) => s.shelf === "Want to Read").length;
    const currentlyReading = shelves.filter(
      (s) => s.shelf === "Currently Reading"
    ).length;
    const read = shelves.filter((s) => s.shelf === "Read").length;

    const readBookIds = shelves
      .filter((s) => s.shelf === "Read")
      .map((s) => s.bookId);

    const readBooks = await db
      .collection("books")
      .find({ _id: { $in: readBookIds } })
      .toArray();

    const genreCounts: { [key: string]: number } = {};
    readBooks.forEach((book) => {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    });

    const topGenres = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([genre, count]) => ({ genre, count }));

    const userReviews = await db
      .collection("reviews")
      .countDocuments({ userId });

    const avgProgress =
      currentlyReading > 0
        ? shelves
            .filter((s) => s.shelf === "Currently Reading")
            .reduce((sum, s) => sum + (s.progress || 0), 0) / currentlyReading
        : 0;

    return NextResponse.json({
      totalBooks: shelves.length,
      wantToRead,
      currentlyReading,
      read,
      topGenres,
      reviewsWritten: userReviews,
      avgProgress: Math.round(avgProgress),
    });
  } catch (error) {
    console.error("Reading stats API error:", error);
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
