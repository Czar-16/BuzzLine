import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, username, password } = await req.json();

    //validation
    if (!name || !email || !username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        {
          status: 400,
        },
      );
    }

    const existingEmail = await UserModel.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exist",
        },
        {
          status: 400,
        },
      );
    }

    const existingUsername = await UserModel.findOne({
      username: username.toLowerCase(),
    });

    if (existingUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already exist",
        },
        {
          status: 400,
        },
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
        },
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
        message: "Registration Failed",
      },
      {
        status: 500,
      },
    );
  }
}
