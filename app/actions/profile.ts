"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

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

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadAvatar(base64Image) {
  const session = await auth();
  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "profile_pictures",
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
      ],
    });

    //Save link to databse
    const user = await prisma.user.update({
      where: { id: session?.user.id },
      data: { image: uploadResponse.secure_url },
    });

    return { success: true, url: uploadResponse.secure_url };
  } catch (error) {
    console.error("Cloudinary Error:", error);
    return { success: false, error: "Gagal upload ke server" };
  }
}
