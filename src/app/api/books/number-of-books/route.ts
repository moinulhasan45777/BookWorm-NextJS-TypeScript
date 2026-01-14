import { mongoConnect } from "@/lib/mongoConnect";
import { NextResponse } from "next/server";

export async function GET() {
  const { db } = await mongoConnect();
  const books = await db.collection("books").countDocuments();
  return NextResponse.json(books);
}
