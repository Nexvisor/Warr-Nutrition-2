import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// This function handles POST requests to the /api/Products/add-flavour endpoint.
export const POST = async (req: NextRequest) => {
  try {
    // 1. Parse the incoming request body to get the JSON data.
    const body = await req.json();

    // 2. Destructure the 'flavours' array from the parsed body.
    const { flavours } = body;

    // 3. Validate the input to ensure 'flavours' is a non-empty array.
    if (!flavours || !Array.isArray(flavours) || flavours.length === 0) {
      // If validation fails, return a 400 Bad Request response.
      return NextResponse.json(
        {
          success: false,
          message: "Please provide at least one flavour.",
        },
        { status: 400 }
      );
    }

    // 4. Map over the array of flavour strings to format them for the database schema.
    const newProductFlavours = await Promise.all(
      flavours.map((flavour: string) =>
        prisma.productFlavor.create({
          data: { flavor: flavour },
        })
      )
    );

    console.log(newProductFlavours);

    // 5. If successful, return a 200 OK response with a success message and the created data.
    return NextResponse.json({
      success: true,
      message: "Flavours added successfully.",
      productFlavours: newProductFlavours,
    });
  } catch (error: any) {
    // 6. If any error occurs during the process, log it to the console for debugging.
    console.error("Error adding product flavours:", error);

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
