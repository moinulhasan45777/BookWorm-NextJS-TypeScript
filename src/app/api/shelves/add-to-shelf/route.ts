import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { db } = await mongoConnect();
    const { userId, bookId, shelf } = await req.json();

    const existingShelf = await db.collection("user_shelves").findOne({
      userId,
      bookId,
    });

    if (existingShelf) {
      const updateData: {
        shelf: string;
        dateStarted?: Date;
        dateFinished?: Date;
      } = { shelf };

      if (shelf === "Currently Reading" && !existingShelf.dateStarted) {
        updateData.dateStarted = new Date();
      }

      if (shelf === "Read" && !existingShelf.dateFinished) {
        updateData.dateFinished = new Date();
      }

      await db
        .collection("user_shelves")
        .updateOne({ userId, bookId }, { $set: updateData });

      return NextResponse.json(
        {
          success: "Shelf updated successfully!",
        },
        {
          status: 200,
        }
      );
    }

    const newShelf = {
      userId,
      bookId,
      shelf,
      progress: 0,
      dateAdded: new Date(),
      dateStarted: shelf === "Currently Reading" ? new Date() : null,
      dateFinished: shelf === "Read" ? new Date() : null,
      userRating: null,
    };

    await db.collection("user_shelves").insertOne(newShelf);

    return NextResponse.json(
      {
        success: "Added to shelf successfully!",
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
