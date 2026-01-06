import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export const POST = async (req: NextRequest) => {
  try {
    // ✅ 1. Parse request body
    const { productId, benefits } = await req.json();

    // ⚠️ 2. Validate input
    if (!productId || !benefits || !Array.isArray(benefits)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid productId and an array of benefits.",
        },
        { status: 400 }
      );
    }

    // ✅ 3. Create multiple product benefits using Promise.all
    const newProductBenefits = await Promise.all(
      benefits.map((benefit: { topic: string; description: string }) =>
        prisma.benefit.create({
          data: {
            productId,
            topic: benefit.topic,
            description: benefit.description,
          },
        })
      )
    );

    // ✅ 4. Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Product benefits added successfully.",
        data: newProductBenefits,
      },
      { status: 200 }
    );
  } catch (error: any) {
    // ❌ 5. Handle unexpected errors
    console.error("Error adding product benefits:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while adding product benefits.",
      },
      { status: 500 }
    );
  }
};
