"use client";
import React from "react";
import { CategoryCard } from "@/app/component/CategorySection/CategoryCard";
import { useRef } from "react";
import PreWorkout from "@/public/Warr/pre.png";
import MultiVitamin from "@/public/Warr/multi_vitamin.png";
import MassGainer from "@/public/Warr/ganner.png";
import ISO from "@/public/Warr/ISO.png";
import Nitro from "@/public/Warr/nitro.png";
import Protine from "@/public/Warr/protine.png";
import Creatine from "@/public/Warr/Ceratine.png";
import { useSelector } from "react-redux";
import { ProductCategory } from "@/utils/DataSlice";
import { RootState } from "@/utils/store";

type CategoryType = ProductCategory & {
  image: string;
};
export function CategorySection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const productCategories = useSelector(
    (state: RootState) => state.dataSlice.productCategories
  );
  const categoryImages: Record<string, string> = {
    "Pre Workout": PreWorkout.src,
    "Mass Gainer": MassGainer.src,
    "Multi Vitamin": MultiVitamin.src,
    ISO: ISO.src,
    Nitro: Nitro.src,
    "Whey Performance": Protine.src,
    Creatine: Creatine.src,
  };

  const categories = productCategories.map((categorie) => ({
    ...categorie,
    image: categoryImages[categorie.category] || "/assets/Warr/default.svg",
  })) as CategoryType[];

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
    <section className="md:py-12">
      <div className="container mx-auto px-3">
        {/* Desktop view - grid */}
        <div className="hidden md:flex flex-wrap justify-center gap-18">
          {categories.map((item: CategoryType) => (
            <CategoryCard
              key={item.id}
              title={item.category}
              image={item.image || "/fallback.jpg"}
              href={`/${item.category}`}
            />
          ))}
        </div>

        {/* Mobile view - horizontal scroll */}
        <div
          ref={scrollContainerRef}
          className="md:hidden flex overflow-x-auto pb-4 gap-10 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((item: CategoryType) => (
            <CategoryCard
              key={item.id}
              title={item.category}
              image={item.image || "/fallback.jpg"}
              href={`/${item.category}`}
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
