import { mongoConnect } from "@/lib/mongoConnect";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { db } = await mongoConnect();
    const { id } = await params;
    const _id = new ObjectId(id);

    const result = await db.collection("reviews").deleteOne({ _id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: "Review deleted successfully!" },
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
