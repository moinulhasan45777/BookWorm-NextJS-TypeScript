"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bookworm_token")?.value;

  if (!token) return null;

  try {
    const user = jwt.verify(token, JWT_SECRET!) as {
      name: string;
      photo: string;
      email: string;
      role: string;
      joiningDate: Date;
    };
    return user;
  } catch {
    return null;
  }
}
