import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import ConversationModel from "@/models/Conversation";
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

    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User id is required",
        },
        {
          status: 400,
        },
      );
    }
    const currentUserId = session.user.id;

    let conversation = await ConversationModel.findOne({
      participants: {
        $all: [currentUserId, userId],
      },
    });
    if (conversation) {
      return NextResponse.json(
        {
          success: true,
          conversation,
        },
        {
          status: 200,
        },
      );
    }

    conversation = await ConversationModel.create({
      participants: [currentUserId, userId],
    });
    return NextResponse.json(
      {
        success: true,
        conversation,
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
        message: "Failed to create conversation",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET() {
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

    const conversations = await ConversationModel.find({
      participants: session.user.id,
    });
    return NextResponse.json(
      {
        success: true,
        conversations,
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
        message: "Failed to fetch conversations",
      },
      {
        status: 500,
      },
    );
  }
}
