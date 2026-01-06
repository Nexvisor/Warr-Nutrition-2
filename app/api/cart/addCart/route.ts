import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

// This function handles POST requests to add a product to a user's cart.
export const POST = async (req: NextRequest) => {
  try {
    // Step 1: Parse the request body to get userId, productId, and quantity.
    const { userId, productId, quantity } = await req.json();

    // Step 2: Validate the input to ensure all required fields are present and valid.
    if (!userId || !productId || !quantity) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid input: userId, productId, and quantity are required.",
        },
        { status: 400 }
      );
    }

    // Step 3: Verify the user exists in the database.
    // It's good practice to ensure the user exists before proceeding.
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

    // Step 4: Find the user's cart or create a new one if it doesn't exist.
    // `upsert` is a convenient Prisma operation that either updates an existing record or creates a new one.
    const cart = await prisma.cart.upsert({
      where: {
        userId,
      },
      update: {}, // No updates needed on the cart itself if it exists.
      create: {
        userId,
      },
    });

    // Step 5: Check if the product already exists in the user's cart.
    const existingCartItem = await prisma.cartItems.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    let cartItem;

    if (existingCartItem) {
      // Step 6a: If the item exists, update its quantity.
      cartItem = await prisma.cartItems.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
        include: { product: true },
      });
    } else {
      // Step 6b: If the item does not exist, create a new cart item.
      cartItem = await prisma.cartItems.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity,
        },
        include: {
          product: {
            include: {
              productImages: true,
            },
          },
        },
      });
    }

    // Step 7: Return a successful response with the created or updated cart item.
    return NextResponse.json({
      success: true,
      data: {
        cartId: cart.id,
        newCartItem: cartItem,
      },
    });
  } catch (error) {
    // Step 8: Handle any unexpected errors that occur during the process.
    console.error("Error adding item to cart:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  }
};
