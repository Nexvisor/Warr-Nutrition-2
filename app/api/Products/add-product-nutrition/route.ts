import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export const POST = async (req: NextRequest) => {
  try {
    // ✅ 1. Parse request body
    const { productId, nutrition } = await req.json();

    // ⚠️ 2. Validate input
    if (!productId || !nutrition || !Array.isArray(nutrition)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide a valid productId and an array of nutrition items.",
        },
        { status: 400 }
      );
    }

    // ✅ 3. Create multiple nutrition entries using Promise.all
    const newNutritionItems = await Promise.all(
      nutrition.map((item: { nutrition: string; quantity: string }) =>
        prisma.nutrition.create({
          data: {
            productId,
            nutrition: item.nutrition,
            quantity: item.quantity,
          },
        })
      )
    );

    // ✅ 4. Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Product nutrition added successfully.",
        data: newNutritionItems,
      },
      { status: 200 }
    );
  } catch (error: any) {
    // ❌ 5. Handle unexpected errors
    console.error("Error adding product nutrition:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while adding product nutrition.",
      },
      { status: 500 }
    );
  }
};
