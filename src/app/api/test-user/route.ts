import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const users = await UserModel.find();

    return NextResponse.json({
      success: true,
      users,
    })
  } catch (error) {
    console.log(error);
    NextResponse.json(
      {
        success: false,
        message: "Failed to fetch Users",
      },
      {
        status: 500,
      },
    );
  }
}
