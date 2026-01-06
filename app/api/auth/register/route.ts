import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import sendOTP from "@/helper/sendOTP";

export const POST = async (req: NextRequest) => {
  try {
    // 1. Parse the email from the request body.
    const body = await req.json();
    const { email } = body;
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    // 2. Validate the email.
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    // 3. Find an existing user or create a new one if not found.
    // Using `upsert` is a good practice for this "find or create" logic.
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
      },
    });

    try {
      await sendOTP("Warr Nutritions Login OTP", email);
    } catch (sendError) {
      console.error("Error while sending message:", sendError);
      // Optionally return a soft failure instead of crashing
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send OTP. Please try again later.",
        },
        { status: 500 }
      );
    }

    // TODO: Implement email sending logic here to send the OTP to the user.

    // 6. Return a success response.
    return NextResponse.json({
      success: true,
      user,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
};
