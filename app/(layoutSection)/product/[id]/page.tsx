"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/store";
import { Product, ProductImages } from "@/utils/DataSlice";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getActualPrice } from "@/helper/getActualPrice";
import { useAddToCart } from "@/hooks/useAddToCart";
import ChangeProduct from "@/app/component/ChangeProduct/ChangeProduct";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface selectedProductType {
  weight: string;
  flavor: string;
}

function ProductDetails() {
  const { id } = useParams();

  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [currentImageIndex, setcurrentImageIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<selectedProductType>({
    weight: "",
    flavor: "",
  });
  const [quantity, setQuantity] = useState<number>(1);

  const products = useSelector((state: RootState) => state.dataSlice.products);

  const { isPending, addToCart } = useAddToCart();

  const filterProduct = useMemo(() => {
    let productInfo = products.find((product: Product) => product.id === id);
    if (selectedProduct.flavor !== "" && selectedProduct.weight !== "") {
      productInfo = products.find(
        (product: Product) =>
          product.flavor.flavor === selectedProduct.flavor &&
          product.weight === selectedProduct.weight
      );
    }

    return productInfo as Product;
  }, [selectedProduct, id]);

  const similarProducts = products.filter(
    (product: Product) => product.category.id === filterProduct.category.id
  ) as Product[];

  const actualPrice = getActualPrice(
    filterProduct.price,
    filterProduct.discountPercentage
  );

  useEffect(() => {
    setSelectedProduct({
      weight: filterProduct.weight,
      flavor: filterProduct.flavor.flavor,
    });
  }, []);

  const isOutofStuck = filterProduct.stock <= 0;

  const handleImageLoad = (index: number) => {
    setImagesLoaded((prev) => ({ ...prev, [index]: true }));
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const prevImage = () => {
    let index =
      (currentImageIndex - 1 + filterProduct?.productImages.length) %
      filterProduct?.productImages.length;
    setcurrentImageIndex(index);
  };

  const nextImage = () => {
    let index = (currentImageIndex + 1) % filterProduct?.productImages.length;
    setcurrentImageIndex(index);
  };

  const incrementQuantity = () => {
    if (quantity < filterProduct.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-rose-700 hover:text-rose-800 mb-6 md:mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span className="text-sm md:text-base">Back to Home</span>
        </Link>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 mb-12 md:mb-16">
          {/* Product Images */}
          <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 lg:p-8">
            <div className="relative aspect-square overflow-hidden rounded-xl mb-4 md:mb-6">
              {!imagesLoaded[currentImageIndex] &&
                !imageErrors[currentImageIndex] && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Skeleton className="w-full h-full rounded-xl" />
                  </div>
                )}
              {!imageErrors[currentImageIndex] ? (
                <Image
                  src={filterProduct?.productImages[currentImageIndex].url}
                  alt={filterProduct?.title}
                  fill
                  className="object-contain transition-opacity duration-300"
                  priority
                  onLoad={() => handleImageLoad(currentImageIndex)}
                  onError={() => handleImageError(currentImageIndex)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 rounded-xl">
                  <div className="text-center p-4">
                    <p className="text-navy-700 font-medium">
                      Image could not be loaded
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Please try again later
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 md:p-3 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-navy-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 md:p-3 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-navy-700" />
              </button>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex justify-center gap-2 mt-2">
              {filterProduct.productImages.map(
                (imageInfo: ProductImages, index) => (
                  <button
                    key={index}
                    onClick={() => setcurrentImageIndex(index)}
                    className="w-16 h-16 rounded-md overflow-hidden border-2"
                  >
                    <div className="relative w-full h-full">
                      {!imagesLoaded[index] && !imageErrors[index] && (
                        <Skeleton className="absolute inset-0 w-full h-full rounded-md" />
                      )}

                      {!imageErrors[index] ? (
                        <Image
                          src={imageInfo.url || "/placeholder.svg"}
                          alt={`Product thumbnail ${index + 1}`}
                          fill
                          className={`object-cover transition-opacity duration-300 ${
                            imagesLoaded[index] ? "opacity-100" : "opacity-0"
                          }`}
                          onLoad={() => handleImageLoad(index)}
                          onError={() => handleImageError(index)}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 rounded-md">
                          <p className="text-xs text-navy-700">Failed</p>
                        </div>
                      )}
                    </div>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col space-y-4 md:space-y-6">
            {/* Category Badge */}
            <div>
              <span className="inline-block bg-rose-800 text-white text-xs md:text-sm font-semibold px-3 py-1.5 rounded-full">
                {filterProduct?.category.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-navy-900 mb-2">
              {filterProduct.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 md:h-5 md:w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm md:text-base text-gray-600">
                (120 reviews)
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl font-bold text-navy-900">
                ₹{actualPrice}
              </span>
              <span className="text-xl text-gray-500 line-through">
                ₹{filterProduct.price}
              </span>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {filterProduct.discountPercentage}% OFF
              </span>
            </div>

            {/* Quantity Selector */}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={decrementQuantity}
                  className="px-3 py-2 text-navy-700 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="px-3 py-2 text-navy-700 hover:bg-gray-100"
                  disabled={quantity >= filterProduct.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-gray-500">
                {filterProduct.stock} available
              </span>
            </div>

            {/* Add to Cart Button */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {isOutofStuck ? (
                <Button
                  className="w-full bg-rose-700 text-white px-6 py-2 rounded-md shadow-md hover:opacity-90 transition"
                  disabled
                >
                  Out of Stock
                </Button>
              ) : (
                <Button
                  className="w-full bg-rose-800 text-white px-6 py-2 rounded-md shadow-md hover:opacity-90 transition"
                  onClick={() => addToCart(filterProduct.id, quantity)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />{" "}
                  {isPending ? "Please Wait...." : "Add to cart"}
                </Button>
              )}
            </div>

            <ChangeProduct
              similarProducts={similarProducts}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
            />
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="benefits" className="mt-12 w-full">
          {/* Scrollable wrapper only on small screens */}
          <div className="w-full overflow-x-auto scrollbar-none sm:overflow-visible">
            <TabsList className="inline-flex min-w-max bg-slate-100 text-navy-700 gap-2 sm:gap-4 p-1 rounded-lg">
              <TabsTrigger
                value="Description"
                className="px-3 py-2 rounded-md data-[state=active]:bg-rose-800 data-[state=active]:text-white text-xs sm:text-sm md:text-base"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="benefits"
                className="px-3 py-2 rounded-md data-[state=active]:bg-rose-800 data-[state=active]:text-white text-xs sm:text-sm md:text-base"
              >
                Key Benefits
              </TabsTrigger>
              <TabsTrigger
                value="nutrition"
                className="px-3 py-2 rounded-md data-[state=active]:bg-rose-800 data-[state=active]:text-white text-xs sm:text-sm md:text-base"
              >
                Nutrition Info
              </TabsTrigger>
              <TabsTrigger
                value="productHighlights"
                className="px-3 py-2 rounded-md data-[state=active]:bg-rose-800 data-[state=active]:text-white text-xs sm:text-sm md:text-base"
              >
                Product Highlights
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Description */}
          <TabsContent value="Description" className="mt-6">
            <p className="text-gray-700 mb-6 text-sm sm:text-base leading-relaxed">
              {filterProduct.description}
            </p>
          </TabsContent>

          {/* Benefits */}
          <TabsContent value="benefits" className="mt-6">
            <Card className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filterProduct.benifits.map((benefit) => (
                  <div
                    key={benefit.id}
                    className="bg-slate-50 p-4 rounded-lg border border-slate-200 hover:shadow-sm transition"
                  >
                    <h3 className="font-semibold text-navy-800 mb-2">
                      {benefit.topic}
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Nutrition Table */}
          <TabsContent value="nutrition" className="mt-6">
            <Card className="p-4 sm:p-6 md:p-10">
              <h3 className="font-semibold text-navy-800 mb-4 text-base sm:text-lg">
                Nutrition Information
              </h3>

              {/* Table Scroll only */}
              <div className="w-full overflow-x-auto scrollbar-none">
                <table className="w-full min-w-[320px] text-left border-collapse">
                  <thead className="bg-slate-100 text-navy-900">
                    <tr>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-xs sm:text-sm whitespace-nowrap">
                        Nutrient
                      </th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-xs sm:text-sm whitespace-nowrap">
                        Amount
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {filterProduct.nutrition.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm">
                          {item.nutrition}
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm">
                          {item.quantity || "Not applicable"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Highlights */}
          <TabsContent value="productHighlights" className="mt-6">
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
              {filterProduct.productHighlights.map((highlight, index) => (
                <li key={index} className="text-gray-700">
                  {highlight}
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ProductDetails;
