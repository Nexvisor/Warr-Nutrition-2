import { prisma } from "@/utils/prisma";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    // 1. Parse the request body to get the product ID and the highlight to remove.
    const { productId, highlight } = await req.json();

    // 2. Validate that both productId and highlight are provided.
    if (!productId || !highlight) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: productId and highlight are required.",
        },
        { status: 400 }
      );
    }

    // 3. Find the product in the database to ensure it exists.
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { productHighlights: true },
    });

    // 4. If the product doesn't exist, return a 404 Not Found error.
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    // 5. Filter the existing highlights, removing the one that matches the request.
    const updatedHighlights = product.productHighlights.filter(
      (h) => h !== highlight
    );

    // 6. Update the product in the database with the new list of highlights.
    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        productHighlights: updatedHighlights,
      },
    });

    // 7. Return a success response.
    return NextResponse.json(
      { success: true, message: "Product highlight deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    // 8. Handle any unexpected errors during the process.
    console.error("Error deleting product highlight:", error.message);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  }
};
