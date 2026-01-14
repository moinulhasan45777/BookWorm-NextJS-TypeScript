import { mongoConnect } from "@/lib/mongoConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { db } = await mongoConnect();

    const numberOfReviews = await db
      .collection("reviews")
      .countDocuments({ status: "Pending" });

    return NextResponse.json(numberOfReviews);
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
