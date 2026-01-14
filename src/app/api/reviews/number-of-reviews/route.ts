import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authCheck = requireAdmin(req);
  if (!authCheck.success) {
    return authCheck.response;
  }

  try {
    const { db } = await mongoConnect();

    const numberOfReviews = await db
      .collection("reviews")
      .countDocuments({ status: "Pending" });

    return NextResponse.json(numberOfReviews);
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
