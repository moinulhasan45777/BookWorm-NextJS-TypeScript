import { mongoConnect } from "@/lib/mongoConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { db } = await mongoConnect();

    const booksPerGenre = await db
      .collection("books")
      .aggregate([
        {
          $group: {
            _id: "$genre",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
      ])
      .toArray();

    const formattedData = booksPerGenre.map((item) => ({
      genre: item._id,
      count: item.count,
    }));

    return NextResponse.json(formattedData);
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
