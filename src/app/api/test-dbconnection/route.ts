import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json(
      {
        success: true,
        message: "DB Connected Successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        messgae: "DB Connection",
        error,
      },
      {
        status: 500,
      },
    );
  }
}
