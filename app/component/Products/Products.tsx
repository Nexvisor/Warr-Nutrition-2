"use client";
import { Product } from "@/utils/DataSlice";
import { RootState } from "@/utils/store";
import React from "react";
import { useSelector } from "react-redux";
import ProductCard from "@/app/component/comman/ProductCard";
import { SkeletonCard } from "../SkeletonCard/SkeletonCard";
const PRODUCT_IDS = [
  "68ebb9c55c6b8a482d57503d",
  "6910bdb415e865c04f749af5",
  "6910bc0915e865c04f749ae5",
  "6910be8b15e865c04f749b04",
];
function Products() {
  const products = useSelector((state: RootState) => state.dataSlice.products);
  const newProducts = products.filter((product: Product) =>
    PRODUCT_IDS.includes(product.id)
  );

  const isLoading = !products.length || !newProducts.length;

  return (
    <section className="py-10 px-4 sm:px-6 md:px-10 lg:px-16">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#D7223B] mb-10">
        PRODUCTS
      </h2>

      <div
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
             gap-4 sm:gap-6 md:gap-8 place-items-center max-w-7xl mx-auto"
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : newProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </section>
  );
}

export default Products;
