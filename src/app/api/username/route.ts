import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    console.log(session);
    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const { username } = await req.json();
    if (!username) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is required",
        },
        {
          status: 400,
        },
      );
    }

    const existingUser = await UserModel.findOne({
      username: username.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is taken",
        },
        {
          status: 400,
        },
      );
    }

    await UserModel.findOneAndUpdate(
      {
        email: session.user.email.toLowerCase()
      },
      {
        username: username.toLowerCase(),
      },
    );
    return NextResponse.json({
      success: true,
      message: "Username saved successfully",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}
    