import { mongoConnect } from "@/lib/mongoConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { db } = await mongoConnect();
    const res = await db.collection("books").find().toArray();

    return NextResponse.json(res);
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
