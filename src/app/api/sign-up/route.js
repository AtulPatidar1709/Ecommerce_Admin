import { dbConnect } from "@/lib/dbConnect"; // Fixed typo in import
import User from "@/models/user";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs"; // Fixed incorrect import

export async function POST(req) {
  try {
    await dbConnect(); // Fixed typo
    const { name, email, password } = await req.json();

    const exists = await User.findOne({ email });

    if (exists) {
      return NextResponse.json(
        {
          message: "User or Email already exists",
        },
        { status: 400 } // Status code for a bad request
      );
    }

    const hashedPassword = await hash(password, 8); // Corrected `bcrypt` usage
    await User.create({
      name,
      email,
      password: hashedPassword,
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
