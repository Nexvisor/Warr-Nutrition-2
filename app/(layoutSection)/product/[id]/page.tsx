"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
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
import { ImageCompo } from "@/app/component/comman/ImageCompo";
import { useAddToCart } from "@/hooks/useAddToCart";

function ProductDetails() {
  const { id } = useParams();

  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [currentImageIndex, setcurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState<number>(1);

  const products = useSelector((state: RootState) => state.dataSlice.products);
  const cart = useSelector((state: RootState) => state.dataSlice.cart);
  const cartItems = cart?.cartItems;
  const { isPending, addToCart } = useAddToCart();

  const filterProduct = products.find(
    (product: Product) => product.id === id
  ) as Product;

  const sameCategoryPrduct = products.filter(
    (product: Product) =>
      product.category.id === filterProduct.category.id && product.id !== id
  ) as Product[];

  const actualPrice = getActualPrice(
    filterProduct.price,
    filterProduct.discountPercentage
  );
  const userInfo = useSelector((state: RootState) => state.dataSlice.userInfo);

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
                {[1, 2, 3, 4, 5].map((star) => (
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

            {/* Description */}
            <p className="text-gray-700 mb-6">{filterProduct.description}</p>

            {/* Product Highlights */}
            <div className="bg-slate-100 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-navy-900 mb-2">
                Product Highlights
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {filterProduct.productHighlights.map(
                  (highlight: string, index) => (
                    <li key={index} className="text-gray-700">
                      {highlight}
                    </li>
                  )
                )}
              </ul>
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
          </div>
        </div>

        {/* Similar Products */}
        {sameCategoryPrduct.length > 0 && (
          <div className="mb-12 md:mb-16">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8 text-navy-900">
              Similar Products
            </h2>

            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-4 md:pb-0">
                {sameCategoryPrduct.map((product: Product) => (
                  <Link
                    href={`/product/${product.id}`}
                    key={product.id}
                    className="flex-shrink-0 w-[280px] md:w-auto bg-white rounded-xl border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="p-4 md:p-5 flex flex-col h-full">
                      {/* Product Image */}
                      <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
                        <ImageCompo
                          src={
                            product.productImages?.[0]?.url ||
                            "/placeholder.png"
                          }
                          alt={product.title}
                          className="object-contain w-full h-full p-2"
                        />
                      </div>

                      {/* Product Title */}
                      <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm md:text-base mb-3 min-h-[2.5rem]">
                        {product.title}
                      </h3>

                      {/* Price + Discount */}
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-bold text-lg md:text-xl text-gray-900">
                          ₹
                          {getActualPrice(
                            product.price,
                            product.discountPercentage
                          )}
                        </p>
                        <p className="bg-green-100 text-green-700 text-xs md:text-sm font-semibold px-2 py-1 rounded-md">
                          {product.discountPercentage}% OFF
                        </p>
                      </div>

                      {/* Weight + Flavor */}
                      <div className="text-xs md:text-sm text-gray-600 space-y-1 mt-auto">
                        <p className="font-medium">{product.weight}</p>
                        <p className="text-gray-500">{product.flavor.flavor}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tabs Section */}
        <Tabs defaultValue="benefits" className="mt-12">
          <TabsList className="bg-slate-100 text-navy-700 flex gap-4">
            <TabsTrigger
              value="benefits"
              className="data-[state=active]:bg-rose-800 data-[state=active]:text-white"
            >
              Key Benefits
            </TabsTrigger>
            <TabsTrigger
              value="nutrition"
              className="data-[state=active]:bg-rose-800 data-[state=active]:text-white"
            >
              Nutrition Information
            </TabsTrigger>
          </TabsList>
          <TabsContent value="benefits" className="mt-6">
            <Card className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterProduct.benifits.map((benefit) => (
                  <div
                    key={benefit.id}
                    className="bg-slate-50 p-4 rounded-lg border border-slate-200"
                  >
                    <h3 className="font-semibold text-navy-800 mb-2">
                      {benefit.topic}
                    </h3>
                    <p className="text-gray-700">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="nutrition" className="mt-6">
            <Card className="p-6">
              <h3 className="font-semibold text-navy-800 mb-4 text-lg">
                Nutrition Information
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-navy-900">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Nutrient</th>
                      <th className="px-4 py-3 font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filterProduct.nutrition.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">{item.nutrition}</td>
                        <td className="px-4 py-3">
                          {item.quantity || "Not applicable"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ProductDetails;
