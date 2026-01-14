import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireAuth } from "@/lib/auth";

interface ReviewAggregation {
  _id: string;
  avgRating: number;
  reviewCount: number;
}

interface ShelfAggregation {
  _id: string;
  shelfCount: number;
}

interface BookDocument {
  _id: ObjectId | string;
  genre: string;
  [key: string]: unknown;
}

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

    const userShelves = await db
      .collection("user_shelves")
      .find({ userId, shelf: "Read" })
      .toArray();

    const readBookIds = userShelves.map((shelf) => shelf.bookId);

    if (readBookIds.length < 3) {
      const popularBooks = await getPopularBooks(db, readBookIds);
      return NextResponse.json({
        recommendations: popularBooks,
        reason: "fallback",
      });
    }

    const readBookObjectIds = readBookIds.map((id) =>
      typeof id === "string" ? new ObjectId(id) : id
    );

    const readBooks = await db
      .collection("books")
      .find({ _id: { $in: readBookObjectIds } })
      .toArray();

    const genreCounts: { [key: string]: number } = {};
    readBooks.forEach((book) => {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    });

    const topGenres = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);

    const userReviews = await db
      .collection("reviews")
      .find({ userId, bookId: { $in: readBookIds } })
      .toArray();

    const avgUserRating =
      userReviews.length > 0
        ? userReviews.reduce((sum, review) => sum + review.rating, 0) /
          userReviews.length
        : 3;

    const candidateBooks = await db
      .collection("books")
      .find({
        genre: { $in: topGenres },
        _id: { $nin: readBookObjectIds },
      })
      .toArray();

    const bookIds = candidateBooks.map((book) =>
      (book as BookDocument)._id.toString()
    );

    const reviewsAggregation = (await db
      .collection("reviews")
      .aggregate([
        {
          $match: {
            bookId: { $in: bookIds },
            status: "Approved",
            rating: { $gte: avgUserRating - 1 },
          },
        },
        {
          $group: {
            _id: "$bookId",
            avgRating: { $avg: "$rating" },
            reviewCount: { $sum: 1 },
          },
        },
      ])
      .toArray()) as ReviewAggregation[];

    const bookScores = new Map(
      reviewsAggregation.map((r) => [
        r._id,
        {
          avgRating: r.avgRating,
          reviewCount: r.reviewCount,
          score: r.avgRating * Math.log(r.reviewCount + 1),
        },
      ])
    );

    const scoredBooks = (candidateBooks as BookDocument[])
      .map((book) => {
        const bookId = (book._id as ObjectId).toString();
        const stats = bookScores.get(bookId) || {
          avgRating: 0,
          reviewCount: 0,
          score: 0,
        };
        const genreMatch = genreCounts[book.genre as string] || 0;
        return {
          ...book,
          _id: bookId,
          score: stats.score + genreMatch * 2,
          avgRating: stats.avgRating,
          reviewCount: stats.reviewCount,
          genreMatch,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);

    if (scoredBooks.length < 12) {
      const additionalBooks = await getPopularBooks(
        db,
        [...readBookIds, ...scoredBooks.map((b) => b._id)],
        12 - scoredBooks.length
      );
      scoredBooks.push(...additionalBooks);
    }

    return NextResponse.json({
      recommendations: scoredBooks,
      reason: "personalized",
      topGenres,
      genreCounts,
    });
  } catch (error) {
    console.error("Recommendations API error:", error);
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

async function getPopularBooks(
  db: {
    collection: (name: string) => {
      find: (query: object) => {
        limit: (n: number) => { toArray: () => Promise<unknown[]> };
        toArray: () => Promise<unknown[]>;
      };
      aggregate: (pipeline: object[]) => { toArray: () => Promise<unknown[]> };
    };
  },
  excludeIds: string[],
  limit: number = 12
) {
  const excludeObjectIds = excludeIds.map((id) =>
    typeof id === "string" ? new ObjectId(id) : id
  );

  const allBooks = (await db
    .collection("books")
    .find({ _id: { $nin: excludeObjectIds } })
    .limit(limit * 2)
    .toArray()) as BookDocument[];

  if (allBooks.length === 0) {
    return [];
  }

  const bookIds = allBooks.map((book) => (book._id as ObjectId).toString());

  const reviewsAggregation = (await db
    .collection("reviews")
    .aggregate([
      {
        $match: {
          bookId: { $in: bookIds },
          status: "Approved",
        },
      },
      {
        $group: {
          _id: "$bookId",
          avgRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ])
    .toArray()) as ReviewAggregation[];

  const shelvesAggregation = (await db
    .collection("user_shelves")
    .aggregate([
      {
        $match: {
          bookId: { $in: bookIds },
        },
      },
      {
        $group: {
          _id: "$bookId",
          shelfCount: { $sum: 1 },
        },
      },
    ])
    .toArray()) as ShelfAggregation[];

  const bookRatings = new Map(
    reviewsAggregation.map((r) => [
      r._id,
      { avgRating: r.avgRating, reviewCount: r.reviewCount },
    ])
  );

  const bookShelves = new Map(
    shelvesAggregation.map((s) => [s._id, s.shelfCount])
  );

  const scoredBooks = allBooks
    .map((book) => {
      const bookId = (book._id as ObjectId).toString();
      const rating = bookRatings.get(bookId) || {
        avgRating: 0,
        reviewCount: 0,
      };
      const shelfCount = bookShelves.get(bookId) || 0;
      return {
        ...book,
        _id: bookId,
        avgRating: rating.avgRating,
        reviewCount: rating.reviewCount,
        shelfCount,
        genreMatch: 0,
        score: rating.avgRating * 0.5 + shelfCount * 0.3 + Math.random() * 0.2,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scoredBooks;
}
