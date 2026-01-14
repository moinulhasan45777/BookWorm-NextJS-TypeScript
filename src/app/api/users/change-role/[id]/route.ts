import { mongoConnect } from "@/lib/mongoConnect";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export async function PUT(
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
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const _id = new ObjectId(id);
    const updatedUser = await req.json();

    await db.collection("users").updateOne({ _id }, { $set: updatedUser });

    return NextResponse.json(
      { success: "Updated successfully!" },
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
