import { NextRequest, NextResponse } from "next/server";
import { mongoConnect } from "@/lib/mongoConnect";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerLimiter } from "@/lib/rateLimit";

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("No JWT Secret found!");
}

export async function POST(req: NextRequest) {
  const rateLimitResponse = registerLimiter(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const { db } = await mongoConnect();
    const { name, photo, email, password, role, joiningDate } =
      await req.json();

    // Look for email already exists or not
    const user = await db.collection("users").findOne({ email });

    if (user) {
      return NextResponse.json(
        {
          error: "Email already exists. ",
        },
        {
          status: 409,
        }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name: name,
      photo: photo,
      email: email,
      password: hashedPassword,
      role: role,
      joiningDate: joiningDate,
    };

    const result = await db.collection("users").insertOne(newUser);

    // generate JWT
    const token = jwt.sign(
      {
        name,
        photo,
        email,
        role,
        joiningDate,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json(
      {
        success: "Registration Successful!",
        newUser: {
          _id: result.insertedId.toString(),
          name: newUser.name,
          photo: newUser.photo,
          email: newUser.email,
          role: newUser.role,
          joiningDate: newUser.joiningDate,
        },
        token,
      },
      {
        status: 201,
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
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
