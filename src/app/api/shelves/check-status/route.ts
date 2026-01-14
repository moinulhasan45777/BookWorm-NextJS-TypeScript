import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authCheck = requireAuth(request);
  if (!authCheck.success) {
    return authCheck.response;
  }

  try {
    const { db } = await mongoConnect();
    const searchParams = request.nextUrl.searchParams;

    const userId = searchParams.get("userId");
    const bookId = searchParams.get("bookId");

    if (!userId || !bookId) {
      return NextResponse.json(
        {
          error: "Missing userId or bookId",
        },
        {
          status: 400,
        }
      );
    }

    const shelf = await db.collection("user_shelves").findOne({
      userId,
      bookId,
    });

    return NextResponse.json({
      shelf: shelf?.shelf || null,
      progress: shelf?.progress || 0,
    });
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
