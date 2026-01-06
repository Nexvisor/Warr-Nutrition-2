"use client";
import Video from "next-video";
import React from "react";
import GYMVideo from "@/videos/GYM_Video.mp4";

export default function VideoSection() {
  return (
    <section className="w-full bg-gradient-to-br from-[#B50D27] to-[#DA203A] py-10 md:py-20 flex justify-center items-center">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black/10">
          <Video
            src={GYMVideo}
            autoPlay
            loop
            className="w-full h-[220px] sm:h-[300px] md:h-[450px] lg:h-[550px] xl:h-[650px] object-cover rounded-2xl"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
