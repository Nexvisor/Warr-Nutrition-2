"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";

const brands = [
  { id: 1, src: "/brands/nike.png", alt: "Nike" },
  { id: 2, src: "/brands/adidas.png", alt: "Adidas" },
  { id: 3, src: "/brands/underarmour.png", alt: "Under Armour" },
  { id: 4, src: "/brands/puma.png", alt: "Puma" },
  { id: 5, src: "/brands/reebok.png", alt: "Reebok" },
  { id: 6, src: "/brands/newbalance.png", alt: "New Balance" },
  { id: 7, src: "/brands/asics.png", alt: "ASICS" },
  { id: 8, src: "/brands/jordan.png", alt: "Jordan" },
];

export default function BrandSection() {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  // Animate continuous scroll using Framer Motion
  const startScroll = async () => {
    while (true) {
      await controls.start({
        x: ["0%", "-50%"],
        transition: { duration: 25, ease: "linear" },
      });
      await controls.set({ x: "0%" }); // reset after loop
    }
  };

  React.useEffect(() => {
    startScroll();
  }, []);

  React.useEffect(() => {
    if (isHovered) controls.stop();
    else startScroll();
  }, [isHovered]);

  return (
    <section className="relative w-full py-12  overflow-hidden">
      {/* 🌟 Heading */}
      <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#B50D27] mb-6 sm:mb-8 md:mb-10 leading-snug tracking-tight">
        Trusted by Leading Fitness Brands
      </h2>

      {/* 🌟 Brand Marquee Container */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-gray-50 via-gray-50 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-gray-50 via-gray-50 to-transparent z-10" />

        {/* Logos — duplicated for seamless loop */}
        <motion.div className="flex space-x-12 min-w-[200%]" animate={controls}>
          {[...brands, ...brands].map((brand, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-32 sm:w-40 h-16 sm:h-20 grayscale hover:grayscale-0 transition-all duration-300"
            >
              <Image
                src={brand.src}
                alt={brand.alt}
                width={160}
                height={80}
                className="object-contain w-full h-full"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
