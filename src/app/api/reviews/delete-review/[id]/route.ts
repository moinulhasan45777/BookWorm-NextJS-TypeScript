import { mongoConnect } from "@/lib/mongoConnect";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = requireAdmin(req);
  if (!authCheck.success) {
    return authCheck.response;
  }

  try {
    const { db } = await mongoConnect();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }

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
