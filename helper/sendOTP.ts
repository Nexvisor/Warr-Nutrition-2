import { prisma } from "@/utils/prisma";
import generateOTP from "@/helper/generateOTP";
import { sendMessage } from "./sendMessage";

async function sendOTP(subject: string, notifer_email: string) {
  try {
    const user = await prisma.user.findFirst({
      where: { email: notifer_email },
    });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // 2. Generate OTP and expiry
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 60000); // 1 minute expiry
    const message = `Your login OTP is: ${otp}`;

    // 3. Create or update OTP
    await prisma.oTP.upsert({
      where: { userId: user.id },
      update: { code: otp, expiresAt },
      create: { userId: user.id, code: otp, expiresAt },
    });

    // 4. Try sending the message
    try {
      const { success, message: email_message } = await sendMessage(
        message,
        subject,
        notifer_email
      );
      if (!success) {
        return { success, message: email_message };
      }
    } catch (sendError) {
      console.error("Error sending message:", sendError);
      return { success: false, message: "Failed to send OTP message" };
    }

    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("Error sending  email:", error);
    return { success: false, message: "Failed to send OTP", error };
  }
}

export default sendOTP;
