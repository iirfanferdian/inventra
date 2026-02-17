import { prisma } from "@/lib/prisma";
import { hash, genSalt } from "bcryptjs";
import { signIn } from "next-auth/react";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body) {
    }

    console.log(body);

    const email = body.email as string | null;
    const password = body.password as string | null;
    const fullName = body.fullName as string | null;

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
        { message: "User Already Exists", exist: true },
        { status: 409 },
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
