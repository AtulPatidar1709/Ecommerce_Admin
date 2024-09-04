import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    return NextResponse.json(
      {
        message: "Login with Db Database",
      },
      { status: 200 }
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
