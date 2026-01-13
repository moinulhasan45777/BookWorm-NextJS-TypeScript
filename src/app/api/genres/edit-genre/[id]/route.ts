import { mongoConnect } from "@/lib/mongoConnect";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { db } = await mongoConnect();
    const { id } = await params;
    const _id = new ObjectId(id);
    const updatedGenre = await req.json();

    const result = await db
      .collection("genres")
      .updateOne({ _id }, { $set: updatedGenre });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Genre not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: "Updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
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
