"use client";
import React from "react";
import { CategoryCard } from "@/app/component/CategorySection/CategoryCard";
import { useState, useTransition, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
// import { setGroupedByCategory, setProducts } from "@/utils/DataSlice";

import { Product } from "@/utils/DataSlice";
import { RootState } from "@/utils/store";

export function CategorySection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const productCategories = useSelector(
    (state: RootState) => state.dataSlice.productCategories
  );

  const dispatch = useDispatch();
  const groupedByCategory = useSelector(
    (state: any) => state.dataSlice.groupedByCategory
  );

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  //   const loadAndSetProductData = async () => {
  //     try {
  //       const res = await axios.get("/api/getProduct");
  //       startTransition(() => {
  //         const products = res.data.allProducts || [];

  //         // Categorise the product based on their category
  //         const groupedByCategory: Record<string, Product[]> = products.reduce(
  //           (acc: Record<string, Product[]>, product: Product) => {
  //             const category = product.category;

  //             if (!acc[category]) {
  //               acc[category] = [];
  //             }

  //             acc[category].push(product);
  //             return acc;
  //           },
  //           {} as Record<string, Product[]>
  //         );

  //         dispatch(setGroupedByCategory(groupedByCategory));
  //         dispatch(setProducts(products));
  //       });
  //     } catch (err: any) {
  //       setError(err.message);
  //     }
  //   };

  //   useEffect(() => {
  //     loadAndSetProductData();
  //   }, []);

  return (
    <section className="py-12">
      <div className="container mx-auto px-3">
        {/* Desktop view - grid */}
        <div className="hidden md:flex flex-wrap justify-center gap-15">
          {productCategories.map((item) => (
            <CategoryCard
              key={item.id}
              title={item.category}
              image={"/fallback.jpg"}
              href={`/${item.id}`}
            />
          ))}

          {/* {Object.entries(groupedByCategory as Record<string, Product[]>).map(
            ([category, products]) => (
              <CategoryCard
                key={category}
                title={category}
                image={"/fallback.jpg"}
                href={`/${category}`}
              />
            )
          )} */}
        </div>

        {/* Mobile view - horizontal scroll */}
        <div
          ref={scrollContainerRef}
          className="md:hidden flex overflow-x-auto pb-4 gap-3 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {productCategories.map((item) => (
            <CategoryCard
              key={item.id}
              title={item.category}
              image={"/fallback.jpg"}
              href={`/${item.id}`}
            />
          ))}
          {/* {Object.entries(groupedByCategory as Record<string, Product[]>).map(
            ([category, products]) => (
              <CategoryCard
                key={category}
                title={category}
                image={"/fallback.jpg"}
                href={`/${category}`}
              />
            )
          )} */}
        </div>
      </div>
    </section>
  );
}
