import { Product } from "@/utils/DataSlice";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/store";
import DialogCompo from "../DialogCompo";
import EditDialog from "./EditDialog";

interface ProductCardType {
  product: Product;
}

function ProductCard({ product }: ProductCardType) {
  const firstImage =
    product.productImages && product.productImages.length > 0
      ? product.productImages[0].url
      : "/placeholder.svg"; // Fallback image

  const [isOpen, setIsOpen] = useState(false);

  const productCategories = useSelector(
    (state: RootState) => state.dataSlice.productCategories
  );
  const productFlavors = useSelector(
    (state: RootState) => state.dataSlice.productFlavors
  );
  const category = productCategories.find(
    (cat: any) => cat.id === product.categoryId
  );
  const flavor = productFlavors.find((fav: any) => fav.id === product.flavorId);

  return (
    <div className="bg-white border border-gray-200 shadow-lg overflow-hidden rounded-lg flex flex-col group">
      <div className="relative w-full h-60 overflow-hidden">
        <Image
          src={firstImage}
          alt={product.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex-grow">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            {category?.category}
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mt-1 truncate">
            {product.title}
          </h3>
          {flavor?.flavor && (
            <p className="text-sm text-gray-600 mt-1">
              Flavor: {flavor?.flavor}
            </p>
          )}
        </div>

        <Button
          className="mt-2 cursor-pointer bg-red-900 hover:bg-red-800"
          onClick={() => setIsOpen(true)}
        >
          <Pencil /> Edit
        </Button>
      </div>
      <DialogCompo
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
        className="sm:max-w-4xl h-[90vh] overflow-y-auto"
      >
        <EditDialog dialogCloseHandler={setIsOpen} product={product} />
      </DialogCompo>
    </div>
  );
}

export default ProductCard;
