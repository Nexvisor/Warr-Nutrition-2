"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Product } from "@/utils/DataSlice";
import { selectedProductType } from "@/app/(layoutSection)/product/[id]/page";

interface ChangeProductPropsType {
  similarProducts: Product[];
  selectedProduct: selectedProductType;
  setSelectedProduct: React.Dispatch<React.SetStateAction<selectedProductType>>;
}

function ChangeProduct({
  similarProducts,
  selectedProduct,
  setSelectedProduct,
}: ChangeProductPropsType) {
  const uniqueFlavors = similarProducts.reduce(
    (acc: string[], product: Product) => {
      // Check if this ID already exists in the accumulator
      const exists = acc.some((flavor) => product.flavor.flavor === flavor);
      if (!exists) {
        acc.push(product.flavor.flavor);
      }
      return acc; // ✅ must return the accumulator
    },
    []
  );

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <Accordion
        type="single"
        collapsible
        defaultValue="item-1"
        className="w-full border border-[#F9C2C7] bg-[#FFF6F7] rounded-md shadow-sm overflow-hidden"
      >
        <AccordionItem value="item-1" className="border-none">
          {/* --- Accordion Header --- */}
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
              <div>
                <h2 className="font-semibold text-gray-900 text-sm sm:text-base">
                  Choose Flavour and Weight:
                </h2>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">{selectedProduct.flavor}</span>
                  {selectedProduct.weight && <>, {selectedProduct.weight}</>}
                </p>
              </div>
              <span className="text-blue-600 text-sm sm:text-base mt-2 sm:mt-0 cursor-pointer hover:underline">
                Change
              </span>
            </div>
          </AccordionTrigger>

          {/* --- Accordion Body --- */}
          <AccordionContent className="p-4 bg-white border-t border-gray-200 space-y-6">
            {/* ✅ Flavour Section */}
            <div>
              <h3 className="font-semibold text-gray-900 text-sm mb-2">
                Flavour
              </h3>
              <div className="flex flex-wrap gap-2">
                {uniqueFlavors.map((flavour) => {
                  const isSelected = selectedProduct.flavor === flavour;

                  return (
                    <button
                      key={`flavour-${flavour}`}
                      onClick={() =>
                        setSelectedProduct((prev: selectedProductType) => ({
                          ...prev,
                          flavor: flavour,
                        }))
                      }
                      className={`px-3 py-2 text-sm border rounded-md transition-all duration-200 
                        ${
                          isSelected
                            ? "border-[#D7223B] bg-[#FFE6EA] text-[#B50D27] font-medium"
                            : "border-gray-300 hover:border-[#F9C2C7] bg-gray-50 text-gray-700"
                        }`}
                    >
                      {flavour}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ✅ Weight Section */}
            <div>
              <h3 className="font-semibold text-gray-900 text-sm mb-2">
                Weight
              </h3>
              <div className="flex flex-wrap gap-2">
                {/* Extract unique weights from similarProducts */}
                {[...new Set(similarProducts.map((p) => p.weight))].map(
                  (weight, index) => {
                    const isSelected = selectedProduct.weight === weight;
                    return (
                      <button
                        key={`weight-${index}`}
                        onClick={() =>
                          setSelectedProduct((prev: selectedProductType) => ({
                            ...prev,
                            weight: weight,
                          }))
                        }
                        className={`px-3 py-2 text-sm border rounded-md transition-all duration-200 
                          ${
                            isSelected
                              ? "border-[#D7223B] bg-[#FFE6EA] text-[#B50D27] font-medium"
                              : "border-gray-300 hover:border-[#F9C2C7] bg-gray-50 text-gray-700"
                          }`}
                      >
                        {weight}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default ChangeProduct;
