import { connectDB } from "@/lib/db";
import ConversationModel from "@/models/Conversation";
import { NextResponse } from "next/server";



export async function GET(){
  try {
    await connectDB();
    const conversation = await ConversationModel.find();
    return NextResponse.json({
      success: true,
      conversation,
    });
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