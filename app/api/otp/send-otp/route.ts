import sendOTP from "@/helper/sendOTP";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { subject, notifer_email } = await req.json();

    const { success, message } = await sendOTP(subject, notifer_email);
    if (!success) {
      return NextResponse.json({ success, message });
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to send OTP",
      error: (error as Error).message,
    });
  }
};
