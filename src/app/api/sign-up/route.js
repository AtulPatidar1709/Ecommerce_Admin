import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();

    const { name, email, password, googleId } = await req.json();

    // Check if email already exists
    const existsEmail = await User.findOne({ email });

    // Check if googleId exists and is not null
    const existsGoogleId = googleId && (await User.findOne({ googleId }));

    if (existsEmail) {
      return NextResponse.json(
        {
          message: "User or Email already exists",
        },
        { status: 400 }
      );
    }

    if (existsGoogleId) {
      return NextResponse.json(
        {
          message: "Google ID already exists",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 8);
    await User.create({
      name,
      email,
      password: hashedPassword,
      googleId,
    });

    return NextResponse.json(
      {
        message: "User Registered",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something Went Wrong Try Again",
      },
      { status: 500 }
    );
  }
}
