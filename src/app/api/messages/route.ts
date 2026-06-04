import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import ConversationModel from "@/models/Conversation";
import MessageModel from "@/models/Message";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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

    const { conversationId, text } = await req.json();
    if (!conversationId || !text) {
      return NextResponse.json(
        {
          success: false,
          message: "Conversation and text are required",
        },
        {
          status: 400,
        },
      );
    }

    const message = await MessageModel.create({
      sender: session.user.id,
      conversation: conversationId,
      text: text.trim(),
    });

    await ConversationModel.findByIdAndUpdate(conversationId, {
      latestMessage: message._id,
    });
    return NextResponse.json(
      {
        success: true,
        message,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message",
      },
      {
        status: 500,
      },
    );
  }
}
