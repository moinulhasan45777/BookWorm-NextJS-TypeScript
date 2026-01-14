"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { mongoConnect } from "@/lib/mongoConnect";

const JWT_SECRET = process.env.JWT_SECRET;

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bookworm_token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as {
      email: string;
      role: string;
    };

    const { db } = await mongoConnect();
    const user = await db.collection("users").findOne(
      { email: decoded.email },
      {
        projection: {
          _id: 0,
          password: 0,
        },
      }
    );

    if (!user) return null;

    return {
      name: user.name,
      photo: user.photo,
      email: user.email,
      role: user.role,
      joiningDate: user.joiningDate,
    };
  } catch {
    return null;
  }
}
