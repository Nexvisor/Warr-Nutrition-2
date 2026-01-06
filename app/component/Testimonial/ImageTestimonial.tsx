"use client";

import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import Testimonial_1 from "@/public/testimonial/testimonial_1.png";
import Testimonial_2 from "@/public/testimonial/testimonial_2.png";
import Testimonial_3 from "@/public/testimonial/testimonial_3.png";
import Testimonial_4 from "@/public/testimonial/testimonial_4.png";
import Testimonial_5 from "@/public/testimonial/testimonial_5.png";

const testimonials = [
  {
    id: 1,
    img: Testimonial_1.src,
  },
  {
    id: 2,
    img: Testimonial_2.src,
  },
  {
    id: 3,
    img: Testimonial_3.src,
  },
  {
    id: 4,
    img: Testimonial_4.src,
  },
  {
    id: 5,
    img: Testimonial_5.src,
  },
];

export default function ImageTestimonial() {
  const [hovering, setHovering] = useState(false);
  const controls = useAnimation();

  const startScroll = async () => {
    while (true) {
      await controls.start({
        x: ["0%", "-50%"],
        transition: { duration: 25, ease: "linear" },
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
    <section className="bg-gradient-to-br from-[#B50D27] to-[#DA203A]  py-14 md:py-20">
      <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-12 tracking-tight">
        Loved & Trusted By Our Customers
      </h2>

      {/* Infinite Scroll Container */}
      <div
        className="overflow-hidden relative"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <motion.div
          animate={controls}
          className="flex gap-6 min-w-[200%] px-6 py-3"
        >
          {[...testimonials, ...testimonials].map((item, index) => (
            <div
              key={index}
              className="w-60 flex-shrink-0 transition-transform duration-300 ease-out 
  hover:scale-105 hover:-translate-y-1"
            >
              <div className="relative w-full h-72 rounded-xl overflow-hidden shadow-md hover:shadow-xl">
                <Image
                  src={item.img}
                  alt={String(item.id)}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
