import { NextRequest, NextResponse } from "next/server";
import { PROMO_CODES_INFO } from "@/constant/PromoCode";
import { prisma } from "@/utils/prisma";

/**
 * GET /api/promo-code
 * ----------------------------------------------------
 * Purpose:
 * - Validate promo code
 * - Verify user existence
 * - Check whether the promo code is already used by the user
 *
 * Query Params:
 * - code   : Promo code string
 * - userId : User ID
 */
export const GET = async (req: NextRequest) => {
  try {
    /**
     * --------------------------------------------------
     * 1️⃣ Extract query parameters
     * --------------------------------------------------
     */
    const params = Object.fromEntries(req.nextUrl.searchParams);
    const { code, userId } = params;

    /**
     * --------------------------------------------------
     * 2️⃣ Basic request validation
     * --------------------------------------------------
     */
    if (!code || !userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required query parameters (code or userId)",
        },
        { status: 400 }
      );
    }

    /**
     * --------------------------------------------------
     * 3️⃣ Validate promo code existence (static check)
     * --------------------------------------------------
     */
    const promoCodeInfo = PROMO_CODES_INFO.find((item) => item.code === code);

    if (!promoCodeInfo) {
      return NextResponse.json(
        { success: false, message: "Invalid promo code" },
        { status: 400 }
      );
    }

    /**
     * --------------------------------------------------
     * 4️⃣ Fetch user and previously applied promo codes
     * --------------------------------------------------
     */
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        appliedPromoCodes: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    /**
     * --------------------------------------------------
     * 5️⃣ Check if promo code already used by the user
     * --------------------------------------------------
     */

    const isPromoCodeUsed =
      user.appliedPromoCodes?.some((promo) => promo.code === code) ?? false;

    /**
     * --------------------------------------------------
     * 6️⃣ Final success response
     * --------------------------------------------------
     */
    return NextResponse.json(
      {
        success: true,
        isPromoCodeUsed,
        promoCodeInfo,
      },
      { status: 200 }
    );
  } catch (error) {
    /**
     * --------------------------------------------------
     * ❌ Global error handler
     * --------------------------------------------------
     * Logs error for debugging and prevents server crash
     */
    console.error("[PROMO_CODE_VALIDATION_ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while validating promo code",
      },
      { status: 500 }
    );
  }
};
