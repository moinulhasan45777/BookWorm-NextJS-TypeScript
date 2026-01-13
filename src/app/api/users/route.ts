import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { db } = await mongoConnect();
  const users = await db
    .collection("users")
    .find()
    .project({
      password: 0,
    })
    .toArray();
  return NextResponse.json(users);
}
