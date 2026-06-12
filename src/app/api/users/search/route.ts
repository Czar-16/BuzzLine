import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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

    const search = req.nextUrl.searchParams.get("q")?.trim();

    if (!search || search.length < 2) {
      return NextResponse.json({
        success: true,
        users: [],
      });
    }

    const users = await UserModel.find({
      username: {
        $regex: search, // does the partial match searching "cz" returns "czar", "czxtv" etc.
        $options: "i", //case-insensitive
      },
      _id: {
        $ne: session.user.id, // exclude yourself
      },
    })
      .select("username")
      .limit(8);
    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to search users",
      },
      {
        status: 500,
      },
    );
  }
}
