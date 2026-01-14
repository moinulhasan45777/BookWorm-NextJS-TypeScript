import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { db } = await mongoConnect();
    const { userId, bookId } = await req.json();

    const result = await db.collection("user_shelves").deleteOne({
      userId,
      bookId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Shelf entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: "Removed from shelf successfully!" },
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
