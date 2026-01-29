"user server";
import { prisma } from "@/lib/prisma";
import { hash, genSalt } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;
    const fullName = formData.get("fullName") as string | null;

    //Validasi field
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { message: "All field (email, password, fullName) need to be fill" },
        { status: 400 },
      );
    }

    //Validasi User Exist In Database
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User Already Exists" },
        { status: 400 },
      );
    }

    //Hash Password
    const salt = await genSalt(8);
    const hashedPassword = await hash(password, salt);

    //Create User
    await prisma.user.create({
      data: { name: fullName, email, password: hashedPassword },
    });

    return NextResponse.json(
      { message: "Created account successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
  }
}
