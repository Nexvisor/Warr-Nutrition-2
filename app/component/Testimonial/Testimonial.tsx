"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Video from "next-video";
import Testimonial_1 from "@/videos/testimonial_1.mp4";
export default function Testimonial() {
  const [reelsPerSlide, setReelsPerSlide] = useState(4);
  const controls = useAnimation();
  const [hovering, setHovering] = useState(false);

  // Responsive reel count
  useEffect(() => {
    const updateReelCount = () => {
      if (window.innerWidth < 640) setReelsPerSlide(2);
      else setReelsPerSlide(4);
    };
    updateReelCount();
    window.addEventListener("resize", updateReelCount);
    return () => window.removeEventListener("resize", updateReelCount);
  }, []);

  // Placeholder reel items
  const allReels = Array.from({ length: 5 }, (_, i) => i + 1);

  const startScroll = async () => {
    while (true) {
      await controls.start({
        x: ["0%", "-50%"],
        transition: { duration: 24, ease: "linear" },
      });
      await controls.set({ x: "0%" });
    }
  };

  useEffect(() => {
    startScroll();
  }, []);

  useEffect(() => {
    if (hovering) controls.stop();
    else startScroll();
  }, [hovering]);

  return (
    <section className="w-full bg-gradient-to-br from-[#B50D27] to-[#DA203A] py-12 md:py-20 flex flex-col justify-center items-center mb-3">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            What Our Customers Say
          </h2>
          <p className="mt-3 text-base sm:text-lg text-rose-100 max-w-2xl mx-auto">
            Real feedback from athletes, fitness enthusiasts & loyal fans.
          </p>
        </div>

        {/* Infinite Scroll Carousel */}

        <div
          className="overflow-hidden relative"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <motion.div animate={controls} className="flex gap-6 w-fll px-6 py-3">
            {[...allReels, ...allReels].map((item, index) => (
              <div
                key={index}
                className="rounded-xl w-60 min-h-[320px] shadow-lg border bg-gray-200 
  flex-shrink-0 transition-transform duration-300 ease-out 
  hover:scale-105 hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden"
              >
                <Video
                  src={Testimonial_1}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover rounded-xl"
                />
                {/* <video
                  src="/videos/testimonial_1.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover rounded-xl"
                /> */}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
