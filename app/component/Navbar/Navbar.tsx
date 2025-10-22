"use client";
import axios from "axios";
import React, { useEffect, useState, useTransition } from "react";
import { useDispatch } from "react-redux";
import {
  ProductCategory,
  ProductFlavor,
  setProductCategory,
  setProductFlavor,
  setProducts,
} from "@/utils/DataSlice";
import { Badge } from "@/components/ui/badge";

import Loader from "@/app/component/Loader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, User, Shield } from "lucide-react";
import DialogCompo from "@/app/component/comman/DialogCompo";
import Login from "./Login";

function Navbar() {
  const pathname = usePathname();
  const navigation = useRouter();

  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        getProductFlavour(),
        getPrductCategory(),
        getProducts(),
      ]);
    };
    startTransition(fetchData);
  }, []);

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
  if (isPending) {
    return <Loader />;
  }
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
                      {/* {Array.isArray(cart?.items) && cart.items.length > 0
                        ? cart.items.length
                        : 0} */}
                    </Badge>
                  </Link>
                </>
              )}

              {status !== "authenticated" && (
                <Button
                  className="bg-gradient-to-br from-[#1e7ae4] to-[#052f5e] text-white px-6 py-2 rounded-md shadow-md hover:opacity-90 transition"
                  onClick={() => setIsOpen(true)}
                >
                  Login
                </Button>
              )}
            </div>
          </>
        )}
      </div>
      <DialogCompo
        isOpen={isOpen}
        onOpenChange={() => setIsOpen((prev: boolean) => !prev)}
      >
        <Login setIsOpen={setIsOpen} />
      </DialogCompo>
    </header>
  );
}

export default Navbar;
