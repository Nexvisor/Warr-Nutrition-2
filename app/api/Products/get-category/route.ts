import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  const productCategorys = await prisma.productCategory.findMany({ where: {} });
  return NextResponse.json({ success: true, productCategorys });
};
