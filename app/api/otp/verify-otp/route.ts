import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { userId, code } = await req.json();

    // Validate input
    if (!userId || !code) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check OTP validity
    const isOtpValid = await prisma.oTP.findFirst({
      where: {
        userId,
        code: code.toString(),
        expiresAt: { gt: new Date() },
      },
    });

    if (!isOtpValid) {
      return NextResponse.json(
        { success: false, message: "OTP expired or invalid" },
        { status: 401 }
      );
    }

    // Clean up the used OTP
    await prisma.oTP.delete({
      where: {
        id: isOtpValid.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "OTP is now verified",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};
