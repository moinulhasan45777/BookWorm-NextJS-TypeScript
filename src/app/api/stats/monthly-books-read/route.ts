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

    if (!userId) {
      return NextResponse.json(
        {
          error: "Missing userId",
        },
        {
          status: 400,
        }
      );
    }

    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);

    const shelves = await db
      .collection("user_shelves")
      .find({
        userId,
        shelf: "Read",
        dateFinished: { $gte: yearStart },
      })
      .toArray();

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyCounts: { [key: number]: number } = {};
    for (let i = 0; i < 12; i++) {
      monthlyCounts[i] = 0;
    }

    shelves.forEach((shelf) => {
      if (shelf.dateFinished) {
        const month = new Date(shelf.dateFinished).getMonth();
        monthlyCounts[month]++;
      }
    });

    const monthlyData = monthNames.map((month, index) => ({
      month,
      count: monthlyCounts[index],
    }));

    return NextResponse.json(monthlyData);
  } catch (error) {
    console.error("Monthly books read API error:", error);
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
