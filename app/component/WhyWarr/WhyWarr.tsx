"use client";

import React from "react";
import Image from "next/image";
import Why1 from "@/public/Why/Why1.svg";
import Why2 from "@/public/Why/Why2.svg";
import Why3 from "@/public/Why/Why3.svg";
function WhyWarr() {
  const reasons = [
    {
      id: 1,
      img: Why1.src,
      title: "Wide range of Nutritional products",
      desc: "One-stop fitness and health destination",
    },
    {
      id: 2,
      img: Why2.src,
      title: "100% Original & Authentic",
      desc: "Tight control on sourcing and distribution",
    },
    {
      id: 3,
      img: Why3.src,
      title: "Guide to Fit and Healthy Lifestyle",
      desc: "Your true partner in health & wellness journey",
    },
  ];

  return (
    <section className="w-full py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        {/* 🌟 Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] mb-8 sm:mb-12">
          Why Warr Nutrition
        </h2>

        {/* 🌟 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 justify-items-center">
          {reasons.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center max-w-xs sm:max-w-sm px-4 py-2"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-xl bg-[#FFF6F7] mb-4 sm:mb-5">
                <Image
                  src={item.img}
                  alt={item.title}
                  width={64}
                  height={64}
                  className="object-contain w-10 h-10 sm:w-12 sm:h-12"
                />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#111827] mb-1 sm:mb-2 leading-snug">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-xs">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyWarr;
