import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { id, username, email, phoneNumber } = await req.json();

    // Check if user exists
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    // Check if email has changed and if it's already taken by another user
    if (email && email !== user.email) {
      const emailExists = await prisma.user.findFirst({
        where: {
          email,
          NOT: {
            id, // Exclude current user
          },
        },
      });

      if (emailExists) {
        return NextResponse.json({
          success: false,
          message:
            "This email is already registered. Please use a different email address.",
        });
      }
    }

    // Check if phone number has changed and if it's already taken by another user
    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      const phoneExists = await prisma.user.findFirst({
        where: {
          phoneNumber,
          NOT: {
            id, // Exclude current user
          },
        },
      });

      if (phoneExists) {
        return NextResponse.json({
          success: false,
          message:
            "This phone number is already registered. Please use a different phone number.",
        });
      }
    }

    // Update user profile
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        username,
        email,
        phoneNumber,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile. Please try again later.",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
