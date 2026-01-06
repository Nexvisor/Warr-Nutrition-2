import { prisma } from "@/utils/prisma";
import { NextResponse, NextRequest } from "next/server";
import ImageKitAuth from "@/constant/ImageKitAuth";
import axios from "axios";

export const POST = async (req: NextRequest) => {
  try {
    // ✅ Parse incoming request body
    const { imageKitId, imageId } = await req.json();

    if (!imageKitId || !imageId) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters." },
        { status: 400 }
      );
    }

    // ✅ Prepare API options for deleting image from ImageKit
    const options = {
      method: "DELETE",
      url: `https://api.imagekit.io/v1/files/${imageKitId}`,
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${ImageKitAuth}`,
      },
    };

    try {
      // ✅ Delete image from ImageKit first
      await axios.request(options);
    } catch (error: any) {
      console.error(
        "❌ ImageKit Deletion Error:",
        error.response?.data || error.message
      );
      return NextResponse.json(
        { success: false, message: "Failed to delete image from ImageKit." },
        { status: 500 }
      );
    }

    try {
      // ✅ Delete corresponding image record from database
      await prisma.productImages.delete({
        where: {
          id: imageId, // ✅ Use imageId (not imageKitId) for database deletion
        },
      });
    } catch (dbError: any) {
      console.error("❌ Database Deletion Error:", dbError.message);
      return NextResponse.json(
        {
          success: false,
          message: "Image deleted from ImageKit but not from database.",
        },
        { status: 500 }
      );
    }

    // ✅ Return success response if both operations succeed
    return NextResponse.json(
      { success: true, message: "Image deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    // ⚠️ Handle unexpected server errors
    console.error("❌ Unexpected Error:", error.message);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
};
