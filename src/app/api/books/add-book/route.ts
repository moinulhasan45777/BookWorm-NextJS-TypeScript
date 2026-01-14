import { mongoConnect } from "@/lib/mongoConnect";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const authCheck = requireAdmin(req);
  if (!authCheck.success) {
    return authCheck.response;
  }

  try {
    const { db } = await mongoConnect();
    const newBook = await req.json();

    await db.collection("books").insertOne(newBook);

    return NextResponse.json(
      {
        success: "Added Successfully!",
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
        status: 404,
      }
    );
  }
}
