import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    // ✅ 1. Parse request body
    const {
      productId,
      title,
      description,
      price,
      discountPercentage,
      stock,
      categoryId,
      flavorId,
      weight,
    } = await req.json();

    // ⚠️ 2. Validate all required fields
    if (
      !productId ||
      !title ||
      !description ||
      price === undefined ||
      discountPercentage === undefined ||
      stock === undefined ||
      !categoryId ||
      !flavorId ||
      !weight
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid inputs. Please provide all required fields.",
        },
        { status: 400 }
      );
    }

    // ✅ 3. Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    // ✅ 4. Update the product in database
    await prisma.product.update({
      where: { id: productId },
      data: {
        title,
        description,
        price,
        discountPercentage,
        stock,
        categoryId,
        flavorId,
        weight,
      },
    });

    // ✅ 5. Return success response
    return NextResponse.json(
      { success: true, message: "Product updated successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    // ❌ 6. Handle unexpected errors
    console.error("Error updating product:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while updating product.",
      },
      { status: 500 }
    );
  }
};
