"use client";

import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Aman Sharma",
    role: "Fitness Athlete",
    review:
      "These supplements boosted my energy levels like never before! The quality is unmatched 🔥",
    img: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Neha Patel",
    role: "Wellness Expert",
    review:
      "I'm impressed with the results! Absolutely love the taste and effectiveness 💪",
    img: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Rohit Kumar",
    role: "Gym Trainer",
    review:
      "Highly recommended for anyone serious about performance and muscle recovery 🏋️‍♂️",
    img: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Simran Kaur",
    role: "Bodybuilding Enthusiast",
    review:
      "Amazing taste and noticeable progress! Feeling stronger every single day ⚡",
    img: "/placeholder.svg",
  },
  {
    id: 5,
    name: "Vikas Verma",
    role: "Sports Nutrition Coach",
    review:
      "Perfect blend of power and purity! My athletes trust it completely 🏆",
    img: "/placeholder.svg",
  },
  {
    id: 6,
    name: "Priya Singh",
    role: "CrossFit Trainer",
    review:
      "My stamina has doubled during workouts! This brand truly stands out ⭐",
    img: "/placeholder.svg",
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
        Loved & Trusted By Professionals
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
              className=" rounded-xl p-6 w-60 min-h-[320px] shadow-lg border bg-gray-200 flex-shrink-0 
  transition-transform duration-300 ease-out hover:scale-105 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 ">
                  <Image
                    src={item.img}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
              </div>

              <p className="text-gray-700 text-center mb-4 italic">
                “{item.review}”
              </p>

              <h3 className="text-center font-bold text-gray-900">
                {item.name}
              </h3>
              <p className="text-center text-gray-500 text-sm">{item.role}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
