import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export const POST = async (req: NextRequest) => {
  try {
    // ✅ 1. Parse request body
    const { productId, productHighlights } = await req.json();

    // ⚠️ 2. Validate input
    if (!productId || !productHighlights || !Array.isArray(productHighlights)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide a valid productId and an array of product highlights.",
        },
        { status: 400 }
      );
    }
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json({
        success: false,
        message: "Product not found",
      });
    }

    const updatedProductHighlight = [
      ...product.productHighlights,
      ...productHighlights,
    ];

    // ✅ 3. Create multiple product highlights
    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        productHighlights: updatedProductHighlight,
      },
    });

    // ✅ 4. Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Product highlights added successfully.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    // ❌ 5. Handle unexpected errors
    console.error("Error adding product benefits:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while adding product benefits.",
      },
      { status: 500 }
    );
  }
};
