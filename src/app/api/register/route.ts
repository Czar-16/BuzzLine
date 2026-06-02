import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long"),

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username is too long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores",
    ),

  email: z.string().trim().email("Invalid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

   
    body.email = body.email?.toLowerCase();
    body.username = body.username?.toLowerCase();

    
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error.issues[0].message,
        },
        {
          status: 400,
        },
      );
    }

    const { name, email, username, password } = validation.data;

   
    const existingEmail = await UserModel.findOne({
      email,
    });

    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        {
          status: 400,
        },
      );
    }

    
    const existingUsername = await UserModel.findOne({
      username,
    });

    if (existingUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already exists",
        },
        {
          status: 400,
        },
      );
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const user = await UserModel.create({
      name,
      email,
      username,
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
    console.error("Registration Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Registration failed",
      },
      {
        status: 500,
      },
    );
  }
}
