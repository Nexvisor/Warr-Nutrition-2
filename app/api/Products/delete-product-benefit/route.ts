import { prisma } from "@/utils/prisma";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    // ✅ Parse request body
    const { benefitId } = await req.json();

    // ⚠️ Validate input
    if (!benefitId) {
      return NextResponse.json(
        { success: false, message: "Benefit ID is required." },
        { status: 400 }
      );
    }

    // ✅ Check if the benefit record exists
    const benefit = await prisma.benefit.findUnique({
      where: { id: benefitId },
    });

    if (!benefit) {
      return NextResponse.json(
        { success: false, message: "Benefit not found." },
        { status: 404 }
      );
    }

    // ✅ Delete the benefit record from database
    await prisma.benefit.delete({
      where: { id: benefitId },
    });

    // ✅ Return success response
    return NextResponse.json(
      { success: true, message: "Benefit deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    // ⚠️ Handle unexpected errors
    console.error("❌ Error deleting benefit:", error.message);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
};
