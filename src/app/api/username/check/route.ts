import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest){

  try {
    await connectDB();
    const username = req.nextUrl.searchParams.get("username");

    if(!username){
      return NextResponse.json({
        available: false,
        message: "Username required",
      },{
        status: 400
      })
    }

    const existingUser = await UserModel.findOne({
      username: username.toLowerCase()
    })

    return NextResponse.json({
      available: !existingUser
    })
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        available: false,
      },
      {
        status: 500,
      },
    );
    
  }
}