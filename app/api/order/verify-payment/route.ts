import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/utils/prisma";
import { sendMessage } from "@/helper/sendMessage";
import { getHours, getMinutes } from "date-fns";
import { getActualPrice } from "@/helper/getActualPrice";
import { PromoCodeInfoType } from "@/constant/PromoCode";
export const POST = async (req: NextRequest) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      cartId,
      products,
      totalPrice,
      userId,
      addressId,
      promoApplied,
    } = await req.json();

    if (
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature ||
      !cartId ||
      !products?.length ||
      !totalPrice ||
      !userId ||
      !addressId
    ) {
      return NextResponse.json({ success: false, message: "Invalid inputs" });
    }
    // 1. Verify the signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.Secret_key!)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (razorpaySignature !== expectedSignature) {
      return NextResponse.json(
        { success: false, message: "Invalid Signature" },
        { status: 401 }
      );
    }

    // Create order in DB
    const newOrder = await prisma.order.create({
      data: {
        userId,
        total: totalPrice,
        razorpay_id: razorpayOrderId,
        addressId,
        status: "PAID",
      },
    });
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
      },
    });

    // Create order items
    await prisma.orderItems.createMany({
      data: products.map((product: any) => ({
        orderId: newOrder.id,
        productId: product.product.id,
        quantity: product.quantity,
        orderPrice: getActualPrice(
          product.product.price,
          product.product.discountPercentage
        ),
      })),
    });

    // deleting cart items
    await prisma.cartItems.deleteMany({
      where: {
        cartId: cartId,
      },
    });

    // deleting cart products
    await prisma.cart.delete({
      where: {
        id: cartId,
      },
    });

    // if promo code is applied
    if ((promoApplied as PromoCodeInfoType).discount !== 0) {
      // when all done then save the promo code to the db based on the user id

      await prisma.promoCode.create({
        data: {
          code: promoApplied.code,
          discount: promoApplied.discount,
          userId: userId,
          orderId: newOrder.id,
        },
      });
    }

    const userInfo = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        phoneNumber: true,
      },
    });

    products.map(async (product: any) => {
      const message = `---- ORDER CONFIRM ----
        userId: ${userId}
        username: ${userInfo?.username}
        email: ${userInfo?.email}
        phone: ${userInfo?.phoneNumber}
        orderId: ${newOrder.id}
        productId: ${product?.product.id}
        title: ${product.product.title}
        quantity: ${product.quantity}
        address_1: ${address?.address1}
        address_2: ${address?.address2}
        pincode: ${address?.pincode}
        city: ${address?.city}
        state: ${address?.state}
        paidPrice: ${getActualPrice(
          product.product.price,
          product.product.discountPercentage
        )}
        orderAt: ${getDateTime(newOrder.createdAt)}
    `;

      // Sending message to the Mail to the of the WARR nutrition
      await sendMessage(
        message,
        `Order Confirm for ${userInfo?.username}`,
        process.env.NOTIFER_EMAIL!
      );
    });

    return NextResponse.json({
      success: true,
      message: "Order confirm",
    });
  } catch (error: any) {
    console.log(error.message);
  }
};

function getDateTime(dateString: Date) {
  const dateInfo = new Date(dateString);
  let date = dateInfo.getDate();
  let month = dateInfo.getMonth() + 1;
  let year = dateInfo.getFullYear();

  let hours = getHours(dateInfo);
  let minutes = getMinutes(dateInfo);

  return `${date}-${month}-${year} ${hours}:${minutes}`;
}
