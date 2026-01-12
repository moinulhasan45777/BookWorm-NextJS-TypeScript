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
    const { client, db } = await mongoConnect();
    const { name, photo, email, password, role } = await req.json();

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

    await db.collection("users").insertOne({
      name: name,
      photo: photo,
      email: email,
      password: hashedPassword,
      role: role,
    });

    // generate JWT
    const token = jwt.sign(
      {
        email,
        role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        success: "Registration Successful!",
        token,
      },
      {
        status: 201,
      }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Internal server error", err },
      { status: 500 }
    );
  }
}
