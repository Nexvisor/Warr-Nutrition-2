import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

/**
 * API endpoint to fetch all products from the database.
 * This route handles GET requests and returns a list of all products
 * with their associated details.
 */
export const GET = async () => {
  try {
    // 1. Fetch all products from the database using Prisma.
    // The `findMany` query retrieves all records from the 'product' table.
    const allProducts = await prisma.product.findMany({
      // The `where` clause is empty, which means we are not filtering and want all products.
      where: {},
      // 2. Eagerly load related data for each product.
      // The `include` object specifies which related tables (models) to join
      // and which fields from those tables to select.
      include: {
        productImages: {
          select: {
            id: true,
            url: true,
            imageKitId: true,
          },
        },
        category: {
          select: {
            id: true,
            category: true,
          },
        },
        flavor: {
          select: {
            id: true,
            flavor: true,
          },
        },
        nutrition: {
          select: {
            id: true,
            nutrition: true,
            quantity: true,
          },
        },
        benifits: {
          select: {
            id: true,
            topic: true,
            description: true,
          },
        },
      },
    });

    // 3. Return a successful response.
    // The response is a JSON object containing a success flag and the array of products.
    // The nullish coalescing operator (?? []) ensures we always return an array, even if `allProducts` is null or undefined.
    return NextResponse.json({ success: true, products: allProducts ?? [] });
  } catch (error: any) {
    // 4. Handle any errors that occur during the database query.
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
