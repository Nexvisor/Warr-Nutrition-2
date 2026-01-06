import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

/**
 * API endpoint to create a new product in the database.
 * It handles the POST request, validates the incoming data,
 * and creates a new product along with its related entities
 * like images, benefits, and nutrition information.
 */

export const POST = async (req: NextRequest) => {
  try {
    // 1. Destructure and extract data from the request body.
    const {
      title,
      description,
      imageUrls, // Expecting an array of objects like [{ url: '...' }]
      price,
      discountPercentage,
      stock,
      categoryId,
      flavorId,
      weight,
      keyBenefits, // Expecting an array of objects like [{ topic: '...', description: '...' }]
      nutritionInformation, // Expecting an array of objects like [{ nutrition: '...', quantity: '...' }]
      productHighlights, // Expecting an array of strings
    } = await req.json();

    // 2. Validate that all required fields are present and valid in the request.
    if (
      !title ||
      !description ||
      !categoryId ||
      !price ||
      !imageUrls ||
      imageUrls.length === 0 ||
      !discountPercentage ||
      !stock ||
      !keyBenefits ||
      keyBenefits.length === 0 ||
      !nutritionInformation ||
      nutritionInformation.length === 0 ||
      !productHighlights ||
      productHighlights.length === 0
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 3. Create a new product in the database using Prisma.
    const product = await prisma.product.create({
      data: {
        title,
        description,
        productImages: {
          createMany: {
            data: imageUrls.map(
              (info: { imageKitId: string; url: string }) => ({
                imageKitId: info.imageKitId,
                url: info.url,
              })
            ), // works if productImages table uses UncheckedCreateInput
          },
        },
        price,
        discountPercentage,
        stock,
        categoryId,
        flavorId,
        weight,
        productHighlights: productHighlights ?? [],
        benifits: {
          create: keyBenefits, // array of objects
        },
        nutrition: {
          create: nutritionInformation, // array of objects
        },
      },
      include: {
        benifits: true,
        nutrition: true,
        productImages: true,
      },
    });
    // 5. Return a success response with the newly created product data.
    return NextResponse.json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error: any) {
    // 6. Handle any errors that occur during the process and return a 500 status code.
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
