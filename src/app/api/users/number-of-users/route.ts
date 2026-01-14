import { mongoConnect } from "@/lib/mongoConnect";
import { NextResponse } from "next/server";

export async function GET() {
  const { db } = await mongoConnect();
  const users = await db.collection("users").countDocuments();
  return NextResponse.json(users);
}
