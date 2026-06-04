import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import MessageModel from "@/models/Message";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const { conversationId } = await params;
    const messages = await MessageModel.find({
      conversation: conversationId,
    }).sort({ createdAt: 1 });
    return NextResponse.json(
      {
        success: true,
        messages,
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
        message: "Failed to fetch messages",
      },
      {
        status: 500,
      },
    );
  }
}
