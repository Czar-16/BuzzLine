import { connectDB } from "@/lib/db";
import MessageModel from "@/models/Message";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const messages = await MessageModel.find();

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch messages",
      },
      {
        status: 500,
      },
    );
  }
}
