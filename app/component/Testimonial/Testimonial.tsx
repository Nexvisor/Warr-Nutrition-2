"use client";

import React, { useState, useEffect } from "react";

export default function Testimonial() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reelsPerSlide, setReelsPerSlide] = useState(4);

  // Handle responsive reel count
  useEffect(() => {
    const updateReelCount = () => {
      if (window.innerWidth < 640) setReelsPerSlide(2); // mobile
      else setReelsPerSlide(4); // tablet & desktop
    };
    updateReelCount();
    window.addEventListener("resize", updateReelCount);
    return () => window.removeEventListener("resize", updateReelCount);
  }, []);

  // Example placeholder reel data (total 12 reels)
  const allReels = Array.from({ length: 12 }, (_, i) => i + 1);
  const slides = Array.from(
    { length: Math.ceil(allReels.length / reelsPerSlide) },
    (_, i) =>
      allReels.slice(i * reelsPerSlide, i * reelsPerSlide + reelsPerSlide)
  );

  return (
    <section className="w-full bg-gradient-to-br from-[#B50D27] to-[#DA203A] py-10 md:py-20 flex justify-center items-center">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black/10">
          {/* Carousel Container */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              width: `${slides.length * 100}%`,
            }}
          >
            {slides.map((slide, slideIndex) => (
              <div
                key={slideIndex}
                className="flex-shrink-0 w-full flex justify-center gap-4 sm:gap-6 md:gap-8 px-4"
                style={{ width: `${100 / slides.length}%` }}
              >
                {slide.map((_, cardIndex) => (
                  <div
                    key={cardIndex}
                    className="w-[45%] sm:w-[40%] md:w-[22%] h-[200px] sm:h-[250px] md:h-[320px] lg:h-[400px] rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 shadow-md hover:scale-105 transition-transform duration-300 relative overflow-hidden"
                  >
                    {/* Placeholder shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />

                    {/* Optional play icon overlay */}
                    <div className="absolute inset-0 flex justify-center items-center">
                      <span className="text-black/40 text-3xl font-bold">
                        ▶
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl pointer-events-none" />

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "bg-white scale-110"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
