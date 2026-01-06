import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  const productFlavors = await prisma.productFlavor.findMany({ where: {} });
  return NextResponse.json({ success: true, productFlavors });
};
