import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { db } = await mongoConnect();
    const { userId, bookId, progress } = await req.json();

    if (progress < 0 || progress > 100) {
      return NextResponse.json(
        { error: "Progress must be between 0 and 100" },
        { status: 400 }
      );
    }

    const updateData: {
      progress: number;
      shelf?: string;
      dateFinished?: Date;
    } = { progress };

    if (progress === 100) {
      updateData.shelf = "Read";
      updateData.dateFinished = new Date();
    }

    await db
      .collection("user_shelves")
      .updateOne({ userId, bookId }, { $set: updateData });

    return NextResponse.json(
      {
        success: "Progress updated successfully!",
        movedToRead: progress === 100,
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
        status: 500,
      }
    );
  }
}
