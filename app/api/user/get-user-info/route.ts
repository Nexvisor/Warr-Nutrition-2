import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

// Define an asynchronous GET request handler.
// This function will be executed when a GET request is made to this API endpoint.
export const GET = async (req: NextRequest) => {
  try {
    // Step 1: Extract the user ID from the request URL's query parameters.
    // The URL object provides an easy way to access search parameters.
    // For a URL like /api/user/get-user-info?id=123, searchParams will contain { 'id' => '123' }.
    const { searchParams } = new URL(req.url);

    // We convert the searchParams into a plain JavaScript object.
    // For example, searchParams.entries() gives us [['id', '123']].
    // Object.fromEntries([['id', '123']]) results in { id: '123' }.
    const params = Object.fromEntries(searchParams.entries());
    const { id } = params;

    // Step 2: Validate if the user ID was provided.
    // If the 'id' is missing, we can't proceed, so we return a 400 Bad Request error.
    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID is required." },
        { status: 400 }
      );
    }

    // Step 3: Fetch the user from the database using the provided ID.
    // We use `prisma.user.findUnique` which is optimized for finding a record by a unique field like 'id'.
    // The `select` option specifies which fields of the user object we want to retrieve.
    // This is good practice as it avoids fetching unnecessary data from the database.
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        username: true,
        phoneNumber: true,
        role: true,
      },
    });

    // Step 4: Handle the case where the user is not found.
    // If `prisma.user.findUnique` returns null, it means no user with that ID exists.
    // We should return a 404 Not Found error.
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // Step 5: Return the user data in a successful response.
    return NextResponse.json({ success: true, user });
  } catch (error) {
    // Step 6: Handle any unexpected errors.
    // The try-catch block will catch any errors that occur during the execution of the `try` block.
    // We log the error for debugging purposes and return a generic 500 Internal Server Error.
    console.error("Error fetching user info:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  }
};
