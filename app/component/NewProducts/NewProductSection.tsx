"use client";
import { PRODUCT_IDS } from "@/constant/PRODUCT_IDS";
import { Product } from "@/utils/DataSlice";
import { RootState } from "@/utils/store";
import React from "react";
import { useSelector } from "react-redux";
import ProductCard from "@/app/component/comman/ProductCard";

function NewProductSection() {
  const products = useSelector((state: RootState) => state.dataSlice.products);
  const newProducts = products.filter((product: Product) =>
    PRODUCT_IDS.includes(product.id)
  );

  return (
    <section className="py-10 px-4 sm:px-6 md:px-10 lg:px-16">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#D7223B] mb-10">
        PREMIUM BLACK SERIES
      </h2>

      <div
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
             gap-4 sm:gap-6 md:gap-8 place-items-center max-w-7xl mx-auto"
      >
        {newProducts.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default NewProductSection;
