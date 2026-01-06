import { prisma } from "@/utils/prisma";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    // ✅ Parse request body
    const { nutritionId } = await req.json();

    // ⚠️ Validate input
    if (!nutritionId) {
      return NextResponse.json(
        { success: false, message: "Nutrition ID is required." },
        { status: 400 }
      );
    }

    // ✅ Check if the nutrition record exists
    const nutrition = await prisma.nutrition.findUnique({
      where: { id: nutritionId },
    });

    if (!nutrition) {
      return NextResponse.json(
        { success: false, message: "Nutrition not found." },
        { status: 404 }
      );
    }

    // ✅ Delete the nutrition record from database
    await prisma.nutrition.delete({
      where: { id: nutritionId },
    });

    // ✅ Return success response
    return NextResponse.json(
      { success: true, message: "Nutrition deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    // ⚠️ Handle unexpected errors
    console.error("❌ Error deleting nutrition:", error.message);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
};
