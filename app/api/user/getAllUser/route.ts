import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export const GET = async () => {
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      createAt: true,
      phoneNumber: true,
      username: true,
    },
  });
  return NextResponse.json({ success: true, allUsers });
};
