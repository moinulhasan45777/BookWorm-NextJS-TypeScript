import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = requireAuth(request);
  if (!authCheck.success) {
    return authCheck.response;
  }

  try {
    const { id } = await params;
    const { db } = await mongoConnect();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          error: "Invalid book ID",
        },
        {
          status: 400,
        }
      );
    }

    const book = await db
      .collection("books")
      .findOne({ _id: new ObjectId(id) });

    if (!book) {
      return NextResponse.json(
        {
          error: "Book not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(book);
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
