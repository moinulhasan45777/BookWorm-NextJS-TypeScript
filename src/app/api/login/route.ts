import { NextRequest, NextResponse } from "next/server";
import { mongoConnect } from "@/lib/mongoConnect";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("No JWT Secret found!");
}

export async function POST(req: NextRequest) {
  try {
    const { db } = await mongoConnect();
    const { email, password } = await req.json();

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    const token = jwt.sign(
      {
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json(
      {
        success: "Login Successful!",
        user: {
          name: user.name,
          photo: user.photo,
          email: user.email,
          role: user.role,
          joiningDate: user.joiningDate,
        },
        token,
      },
      {
        status: 200,
      }
    );

    res.cookies.set({
      name: "bookworm_token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Internal server error", err },
      { status: 500 }
    );
  }
}
