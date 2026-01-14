import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { db } = await mongoConnect();
    const searchParams = request.nextUrl.searchParams;

    const search = searchParams.get("search") || "";
    const genres = searchParams.get("genres") || "";
    const rating = searchParams.get("rating") || "";
    const sortBy = searchParams.get("sortBy") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const skip = (page - 1) * limit;

    const filter: {
      $or?: Array<
        | { title?: { $regex: string; $options: string } }
        | { author?: { $regex: string; $options: string } }
      >;
      genre?: { $in: string[] };
    } = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    if (genres && genres !== "all") {
      const genreArray = genres.split(",").filter((g) => g.trim() !== "");
      if (genreArray.length > 0) {
        filter.genre = { $in: genreArray };
      }
    }

    let books = await db
      .collection("books")
      .find(filter)
      .skip(skip)
      .limit(limit)
      .toArray();

    const bookIds = books.map((book) => book._id.toString());

    const reviewsAggregation = await db
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
      .toArray();

    const bookRatings = new Map(
      reviewsAggregation.map((r) => [
        r._id,
        { avgRating: r.avgRating, reviewCount: r.reviewCount },
      ])
    );

    const shelvesAggregation = await db
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
      .toArray();

    const bookShelves = new Map(
      shelvesAggregation.map((s) => [s._id, s.shelfCount])
    );

    if (rating && rating !== "all") {
      const [minRating, maxRating] = rating.split("-").map(parseFloat);
      books = books.filter((book) => {
        const bookId = book._id.toString();
        const avgRating = bookRatings.get(bookId)?.avgRating || 0;
        return avgRating >= minRating && avgRating <= maxRating;
      });
    }

    if (sortBy === "rating") {
      books.sort((a, b) => {
        const aRating = bookRatings.get(a._id.toString())?.avgRating || 0;
        const bRating = bookRatings.get(b._id.toString())?.avgRating || 0;
        return bRating - aRating;
      });
    } else if (sortBy === "mostShelved") {
      books.sort((a, b) => {
        const aCount = bookShelves.get(a._id.toString()) || 0;
        const bCount = bookShelves.get(b._id.toString()) || 0;
        return bCount - aCount;
      });
    }

    const totalBooks = await db.collection("books").countDocuments(filter);
    const totalPages = Math.ceil(totalBooks / limit);

    return NextResponse.json({
      books,
      totalBooks,
      totalPages,
      currentPage: page,
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
