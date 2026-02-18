"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface IProfileDetails {
  bio: string;
  fullName: string;
}

export const updateProfileDetails = async (data: IProfileDetails) => {
  const session = await auth();

  if (!session) return;
  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { bio: data.bio ? data.bio : "", name: data.fullName },
    });
  } catch (e) {
    if (e.code === "P2002") {
      return {
        success: false,
        message: `Unique Problem`,
      };
    }
    console.log(e);
    return {
      success: false,
      message: "Unknown System Error",
    };
  }

  return {
    success: true,
    message: "Profile Updated",
    data: { bio: data.bio, fullName: data.fullName },
  };
};
