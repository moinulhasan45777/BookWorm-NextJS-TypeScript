import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { db } = await mongoConnect();
    const searchParams = request.nextUrl.searchParams;

    const search = searchParams.get("search") || "";
    const genre = searchParams.get("genre") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const skip = (page - 1) * limit;

    const filter: {
      $or?: Array<
        | { title?: { $regex: string; $options: string } }
        | { author?: { $regex: string; $options: string } }
      >;
      genre?: string;
    } = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    if (genre && genre !== "all") {
      filter.genre = genre;
    }

    const books = await db
      .collection("books")
      .find(filter)
      .skip(skip)
      .limit(limit)
      .toArray();

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
