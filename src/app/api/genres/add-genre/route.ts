import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";

export async function POST(req: NextRequest) {
  try {
    const { db } = await mongoConnect();
    const newGenre = await req.json();

    await db.collection("genres").insertOne(newGenre);

    return NextResponse.json(
      {
        success: "Added Successfully!",
      },
      {
        status: 200,
      }
    );
  } catch {
    return NextResponse.json(
      {
        error: "Something went wrong!",
      },
      {
        status: 401,
      }
    );
  }
}
