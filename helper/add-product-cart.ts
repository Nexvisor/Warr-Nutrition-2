import axios from "axios";

// This function handles the client-side logic for adding a product to the cart.
// It makes a POST request to the '/api/cart/addCart' endpoint.
export const productToCart = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  try {
    // Step 1: Make a POST request to the cart API endpoint.
    // We send the userId, productId, and quantity in the request body.
    const res = await axios.post("/api/cart/addCart", {
      userId,
      productId,
      quantity: quantity, // It's good practice to ensure quantity is a number.
    });

    // Step 2: Destructure the response from the API.
    // We expect 'success', 'message' (on error), and 'data' (on success).
    const { success, message, data } = res.data;

    // Step 3: Handle API-level errors.
    // This checks if the API operation itself was unsuccessful (e.g., validation error).
    if (!success) {
      console.error("API Error:", message);
      return { success, message };
    }

    // Step 4: Return the successful response data.
    return { success, data };
  } catch (error) {
    // Step 5: Handle exceptions during the API call.
    // This will catch network errors or if the API server is down.
    console.error("Failed to add product to cart:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
