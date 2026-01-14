import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { mongoConnect } from "@/lib/mongoConnect";

export async function GET() {
  try {
    const { db } = await mongoConnect();

    const tutorials = await db
      .collection("tutorials")
      .find({})
      .sort({ _id: -1 })
      .toArray();

    return NextResponse.json(tutorials, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch tutorials" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authCheck = requireAdmin(request);
  if (!authCheck.success) {
    return authCheck.response;
  }

  try {
    const body = await request.json();
    const { title, youtubeLink } = body;

    if (!title || !youtubeLink) {
      return NextResponse.json(
        { error: "Title and YouTube link are required" },
        { status: 400 }
      );
    }

    const { db } = await mongoConnect();

    const result = await db.collection("tutorials").insertOne({
      title,
      youtubeLink,
    });

    return NextResponse.json(
      { success: "Tutorial added successfully", id: result.insertedId },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to add tutorial" },
      { status: 500 }
    );
  }
}
