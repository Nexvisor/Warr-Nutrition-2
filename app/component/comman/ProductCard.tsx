import { Product } from "@/utils/DataSlice";
import React from "react";
import { ImageCompo } from "./ImageCompo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getActualPrice } from "@/helper/getActualPrice";
import { useAddToCart } from "@/hooks/useAddToCart";

function ProductCard({ product }: { product: Product }) {
  const { isPending, addToCart } = useAddToCart();
  const isOutofStuck = product.stock <= 0;

  const actualPrice = getActualPrice(product.price, product.discountPercentage);

  return (
    <div className="group relative bg-white border rounded-lg overflow-hidden transition-all hover:shadow-md h-full hover:scale-105">
      <Link href={`/product/${product.id}`} className="block p-2 md:p-4 flex-1">
        <div className="aspect-square relative mb-2 md:mb-4 flex items-center justify-center">
          <ImageCompo
            src={product.productImages[0].url}
            alt={product.title}
            className="object-contain w-full h-full"
          />
        </div>

        <div className="space-y-1 md:space-y-2">
          <h3 className="font-medium text-gray-900 line-clamp-2 text-sm md:text-base">
            {product.title}
          </h3>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm md:text-lg">₹{actualPrice}</span>
            <span className="text-xs md:text-sm text-gray-500 line-through">
              ₹{product.price}
            </span>
            <span className="bg-green-100 text-green-800 text-xs md:text-sm font-medium px-2.5 py-0.5 rounded">
              {product.discountPercentage}% OFF
            </span>
          </div>
        </div>
      </Link>

      <div className="p-2 md:p-4 pt-0">
        {isOutofStuck ? (
          <Button
            className="w-full bg-gray-300 text-gray-700 px-6 py-2 rounded-md shadow-sm cursor-not-allowed"
            disabled
          >
            Out of Stock
          </Button>
        ) : (
          <Button
            className="w-full bg-gradient-to-br from-[#B50D27] to-[#DA203A]
                   text-white px-6 py-2 rounded-md shadow-md 
                   hover:opacity-90 transition"
            onClick={() => addToCart(product.id, 1)}
            disabled={isPending}
          >
            {isPending ? "Please Wait..." : "Add to Cart"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
