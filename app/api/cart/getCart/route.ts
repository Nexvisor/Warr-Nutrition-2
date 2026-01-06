import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

// This function handles GET requests to fetch a user's cart.
export const GET = async (req: NextRequest) => {
  try {
    // Step 1: Extract the userId from the request URL's query parameters.
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // Step 2: Validate that the userId was provided.
    // If not, return a 400 Bad Request error.
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required." },
        { status: 400 }
      );
    }

    // Step 3: Verify the user exists in the database.
    // If the user is not found, return a 404 Not Found error.
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // Step 4: Fetch the user's cart and all associated items and products.
    // We use `findUnique` on the cart with the `userId` index.
    // The `include` statement ensures that related `cartItems` and their corresponding `product` details are fetched in a single query.
    const cart = await prisma.cart.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        cartItems: {
          include: {
            product: {
              include: {
                productImages: true,
              },
            },
          },
        },
      },
    });

    // Step 5: Return the cart data.
    // If the user has no cart yet, `cart` will be null. This is expected and handled by the client.
    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    // Step 6: Handle any unexpected errors that occur during the process.
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  }
};
