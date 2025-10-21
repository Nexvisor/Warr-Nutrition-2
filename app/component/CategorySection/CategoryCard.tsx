import React from "react";

import Link from "next/link";
import { ImageCompo } from "@/app/component/comman/ImageCompo";

interface CategoryCardProps {
  title: string;
  image: string;
  href: string;
}

export function CategoryCard({ title, image, href }: CategoryCardProps) {
  return (
    <div className="flex flex-col gap-3">
      <Link
        href={href}
        className="group flex flex-col items-center justify-center 
             bg-zinc-200 border rounded-full 
             transition-all hover:shadow-md 
             min-w-[100px] sm:min-w-[120px] md:min-w-[140px] 
             w-[100px] sm:w-[120px] md:w-[140px] 
             h-[100px] sm:h-[120px] md:h-[140px] 
             scale-100 hover:scale-110 duration-300 ease-in-out"
      >
        <div
          className="relative flex items-center justify-center 
                  w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 
                  mb-2 sm:mb-3"
        >
          {/* <ImageCompo src={image} alt={title} className="object-contain" /> */}
        </div>
      </Link>
      <h3
        className="text-black 
             transition duration-300 font-medium 
             text-sm md:text-base 
             text-center leading-tight"
      >
        {title}
      </h3>
    </div>
  );
}
