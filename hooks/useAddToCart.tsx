"use client";

import { useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CustomToast } from "@/app/component/comman/customToast";
import { ShoppingCart } from "lucide-react";
import { productToCart } from "@/helper/add-product-cart";
import {
  Cart,
  CartItems,
  setCart,
  setIsLoginDialoagOpen,
} from "@/utils/DataSlice";
import { RootState } from "@/utils/store";

export function useAddToCart() {
  const [isPending, startTransition] = useTransition();
  const dispatch = useDispatch();

  // 🔹 Get data from Redux or wherever you store them
  const { userInfo, products } = useSelector((state: RootState) => ({
    userInfo: state.dataSlice.userInfo,
    products: state.dataSlice.products,
  }));
  const cart = useSelector((state: RootState) => state.dataSlice.cart);
  const cartItems = cart?.cartItems
    ? Array.isArray(cart?.cartItems)
      ? cart?.cartItems
      : ([] as CartItems[])
    : ([] as CartItems[]);

  /**
   * Adds a product to the user's cart.
   * @param {string} productId - The ID of the product to add.
   * @param {number} quantity - The quantity to add.
  
   */
  const addToCart = async (productId: string, quantity: number) => {
    // 🧩 Step 1: Require login
    if (!userInfo.id) {
      dispatch(setIsLoginDialoagOpen(true));
      return;
    }

    const filterProduct = products.find(
      (product: any) => product.id === productId
    );

    // 🧩 Step 2: Async transition to keep UI responsive
    startTransition(async () => {
      try {
        const { success, message, data } = await productToCart(
          userInfo.id as string,
          productId,
          quantity
        );

        if (!success) {
          CustomToast({ message, type: "error" });
          return;
        }

        const { cartId, newCartItem } = data;

        // 🧩 Step 3: Check if item already exists
        const itemExists = Array.isArray(cartItems)
          ? cartItems.some((item: CartItems) => item.id === newCartItem.id)
          : false;

        // 🧩 Step 4: Update cart
        const updatedCart: Cart = {
          id: cartId,
          userId: userInfo.id,
          user: userInfo,
          cartItems: Array.isArray(cartItems)
            ? itemExists
              ? cartItems.map((item: CartItems) =>
                  item.id === newCartItem.id ? newCartItem : item
                )
              : [...cartItems, newCartItem]
            : [newCartItem],
        };

        dispatch(setCart(updatedCart));

        // 🧩 Step 5: Show success toast
        CustomToast({
          message,
          type: "success",
          discription: `${quantity} × ${filterProduct?.title?.substring(
            0,
            30
          )}... added to your cart`,
          icon: <ShoppingCart className="h-5 w-5" />,
        });
      } catch (error) {
        console.error("❌ Error in addToCart:", error);
        CustomToast({
          message: "Something went wrong. Please try again later.",
          type: "error",
        });
      }
    });
  };

  return { addToCart, isPending };
}
