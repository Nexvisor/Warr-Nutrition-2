import React, { useState } from "react";
import DialogCompo from "@/app/component/DialogCompo";
import AddProductCompo from "../AddProductSection/AddProductCompo";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/store";
import { Product } from "@/utils/DataSlice";
import ProductCard from "./ProductCard";
function ProductList() {
  const [isOpen, setIsOpen] = useState(false);
  const products = useSelector((state: RootState) => state.dataSlice.products);

  return (
    <div className="p-8 bg-white m-4 rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          All Warr Nutrition Products
        </h1>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-800 text-white font-semibold px-5 py-2 rounded-lg curosr-pointer hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Add Products
        </button>
      </div>

      {/* Product list will go here */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: Product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
      <DialogCompo
        isOpen={isOpen}
        className="sm:max-w-4xl h-[90vh] overflow-y-auto"
        onOpenChange={() => setIsOpen((prev: boolean) => !prev)}
      >
        <AddProductCompo closeProductDialog={setIsOpen} />
      </DialogCompo>
    </div>
  );
}

export default ProductList;
