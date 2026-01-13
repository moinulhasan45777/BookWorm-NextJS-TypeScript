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
    const updatedBook = await req.json();

    await db.collection("books").updateOne({ _id }, { $set: updatedBook });

    return NextResponse.json(
      { success: "Updated successfully!" },
      { status: 200 }
    );
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
