import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// This function handles POST requests to the /api/Products/add-category endpoint.
export const POST = async (req: NextRequest) => {
  try {
    // 1. Parse the incoming request body to get the JSON data.
    const body = await req.json();
    // 2. Destructure the 'categories' array from the parsed body.
    const { categories } = body;

    // 3. Validate the input to ensure 'categories' is a non-empty array.
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      // If validation fails, return a 400 Bad Request response.
      return NextResponse.json(
        {
          success: false,
          message: "Please provide at least one category.",
        },
        { status: 400 }
      );
    }

    // We map over the array of category strings to format it for the database schema.
    const newProductCategories = await Promise.all(
      categories.map((category: string) =>
        prisma.productCategory.create({
          data: { category },
        })
      )
    );
    console.log(newProductCategories);

    // 5. If successful, return a 200 OK response with a success message and the created data.
    return NextResponse.json({
      success: true,
      message: "Categories added successfully.",
      productCategories: newProductCategories,
    });
  } catch (error: any) {
    // 6. If any error occurs during the process, log it to the console for debugging.
    console.log("Error adding product categories:", error);

    // 7. Return a 500 Internal Server Error response with an error message.
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
