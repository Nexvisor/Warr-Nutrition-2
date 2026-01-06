import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    // Destructure productId and productImages from the request body.
    const { productId, productImages } = await req.json();

    // Find the product in the database using the provided productId.
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    // If the product is not found, return a 404 Not Found response.
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    // Prepare the data array for creating multiple image records.
    const imagesData = productImages.map(
      (img: { imageKitId: string; url: string }) => ({
        productId,
        imageKitId: img.imageKitId,
        url: img.url,
      })
    );

    const newProductImages = await Promise.all(
      imagesData.map((img: any) => prisma.productImages.create({ data: img }))
    );

    // Return a success response with the count of created images.
    return NextResponse.json({
      success: true,
      message: "Images added successfully",
      data: newProductImages,
    });
  } catch (error) {
    // Log the error for debugging purposes.
    console.error("Error adding product images:", error);

    // Return a 500 Internal Server Error response if something goes wrong.
    return NextResponse.json(
      {
        success: false,
        message: "An internal server error occurred.",
      },
      { status: 500 }
    );
  }
};
