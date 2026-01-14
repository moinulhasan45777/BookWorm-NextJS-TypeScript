import { mongoConnect } from "@/lib/mongoConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { db } = await mongoConnect();
    const reviews = await db.collection("reviews").find().toArray();

    return NextResponse.json(reviews);
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
