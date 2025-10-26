"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Cart,
  ProductCategory,
  ProductFlavor,
  setCart,
  setIsLoading,
  setIsLoginDialoagOpen,
  setProductCategory,
  setProductFlavor,
  setProducts,
} from "@/utils/DataSlice";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, User, Shield } from "lucide-react";
import DialogCompo from "@/app/component/comman/DialogCompo";
import Login from "./Login";
import { RootState } from "@/utils/store";
import useUserData from "@/hooks/useUserData";

function Navbar() {
  const pathname = usePathname();
  const navigation = useRouter();

  const dispatch = useDispatch();
  const { status } = useUserData();

  const isLoginDialogOpen = useSelector(
    (state: RootState) => state.dataSlice.isLoginDialoagOpen
  );
  const userInfo = useSelector((state: RootState) => state.dataSlice.userInfo);
  const cart = useSelector((state: RootState) => state.dataSlice.cart);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setIsLoading(true));
      try {
        await Promise.all([
          getProductFlavour(),
          getPrductCategory(),
          getProducts(),
        ]);
      } catch (e: any) {
        console.log("Error is fetching data " + e.message);
      } finally {
        dispatch(setIsLoading(false));
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    getCart();
  }, [userInfo.id]);

  const getPrductCategory = async () => {
    const res = await axios.get("/api/Products/get-category");
    const { productCategorys } = res.data;
    dispatch(setProductCategory(productCategorys as ProductCategory[]));
  };
  const getProductFlavour = async () => {
    const res = await axios.get("/api/Products/get-flavor");
    const { productFlavors } = res.data;
    dispatch(setProductFlavor(productFlavors as ProductFlavor[]));
  };

  const getProducts = async () => {
    const res = await axios.get("/api/Products/get-products");
    const { products } = res.data;
    dispatch(setProducts(products));
  };

  /**
   * Fetches the user's cart from the API and updates the Redux store.
   * This function is called when the component mounts or when the user's info changes.
   */
  const getCart = async () => {
    // Step 1: Guard clause to prevent API calls if there is no logged-in user.
    if (!userInfo.id) return;

    try {
      // Step 2: Make a GET request to the getCart API endpoint with the user's ID.
      const res = await axios.get(`/api/cart/getCart?userId=${userInfo.id}`);
      const { success, data, message } = res.data;

      // Step 3: Handle the API response.
      if (success) {
        // If the API call was successful, update the cart state in Redux.
        // If `data` is null (user has no cart), Redux will store null.
        dispatch(setCart(data));
      } else {
        // If the API returned a failure (e.g., user not found), log the message
        // and reset the cart state in Redux to an empty object.
        console.error("API Error fetching cart:", message);
        dispatch(setCart({} as Cart));
      }
    } catch (error) {
      // Step 4: Handle any unexpected network or server errors during the API call.
      console.error("Failed to fetch cart:", error);
      // Reset the cart state in Redux to ensure a consistent UI on error.
      dispatch(setCart({} as Cart));
    }
  };

  return (
    <header className="border-b sticky top-0 z-50 bg-white">
      <div className="px-4 py-4 flex items-center justify-between md:px-0">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="https://ik.imagekit.io/fcuhugcgk/WAR_Nutrition/Logo.pdf%20(1)%20(1).png?updatedAt=1747399698831"
            alt="Warr Nutrition"
            width={100}
            height={32}
            className="invert"
            style={{ filter: "invert(1) brightness(0)" }}
          />
        </Link>
        {pathname !== "/terms-conditon" && pathname !== "/about" && (
          <>
            {/* Search */}
            {/* <div className="hidden md:flex items-center flex-1 max-w-xl mx-6">
              <SearchDropdown />
            </div> */}

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link
                href="https://verify.warrnutrition.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <Shield className="flex md:hidden" />
                <span className="hidden md:flex text-sm">Authenticity</span>
              </Link>
              {status === "authenticated" && (
                <>
                  <Link
                    href="/account"
                    className="flex items-center gap-1"
                    onClick={() => navigation.push("/account")}
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden md:block text-sm">Account</span>
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center gap-1 relative"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span className="hidden md:inline text-sm">Cart</span>
                    <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                      {/* checking cart is empty or not */}
                      {Array.isArray(cart?.cartItems) &&
                      cart.cartItems.length > 0
                        ? cart.cartItems.length
                        : 0}
                    </Badge>
                  </Link>
                </>
              )}

              {status !== "authenticated" && (
                <Button
                  className="bg-gradient-to-br from-[#1e7ae4] to-[#052f5e] text-white px-6 py-2 rounded-md shadow-md hover:opacity-90 transition"
                  onClick={() =>
                    dispatch(setIsLoginDialoagOpen(!isLoginDialogOpen))
                  }
                >
                  Login
                </Button>
              )}
            </div>
          </>
        )}
      </div>
      <DialogCompo
        isOpen={isLoginDialogOpen}
        onOpenChange={() => dispatch(setIsLoginDialoagOpen(!isLoginDialogOpen))}
      >
        <Login />
      </DialogCompo>
    </header>
  );
}

export default Navbar;
