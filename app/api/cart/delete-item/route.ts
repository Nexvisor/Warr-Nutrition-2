import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest) => {
  try {
    // Handle both query params and body for flexibility
    const url = new URL(req.url);
    const itemId = url.searchParams.get("itemId") || (await req.json()).itemId;

    if (!itemId || typeof itemId !== "string") {
      return NextResponse.json(
        { success: false, message: "Valid itemId (string) required" },
        { status: 400 }
      );
    }

    const result = await prisma.cartItems.delete({
      where: {
        id: itemId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: { deletedItemId: result.id },
        message: "Item removed successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Cart removal error:", error);

    const status = error.message === "Not found" ? 404 : 500;
    return NextResponse.json(
      {
        success: false,
        message:
          status === 404
            ? "Cart item not found"
            : "Failed to remove item. Please try again.",
      },
      { status }
    );
  }
};
