import { mongoConnect } from "@/lib/mongoConnect";
import { NextResponse } from "next/server";

export async function GET() {
  const { db } = await mongoConnect();
  const genres = await db.collection("genres").countDocuments();
  return NextResponse.json(genres);
}
