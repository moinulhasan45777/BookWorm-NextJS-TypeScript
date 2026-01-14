import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authCheck = requireAuth(request);
  if (!authCheck.success) {
    return authCheck.response;
  }

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
      .find({ userId, shelf: "Read" })
      .toArray();

    const readBookIds = shelves.map((shelf) =>
      typeof shelf.bookId === "string"
        ? new ObjectId(shelf.bookId)
        : shelf.bookId
    );

    const readBooks = await db
      .collection("books")
      .find({ _id: { $in: readBookIds } })
      .toArray();

    const genreCounts: { [key: string]: number } = {};
    readBooks.forEach((book) => {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    });

    const genreData = Object.entries(genreCounts)
      .map(([genre, count]) => ({
        genre,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json(genreData);
  } catch (error) {
    console.error("Genre distribution API error:", error);
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
