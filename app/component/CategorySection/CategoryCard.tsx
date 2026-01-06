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
        className="group flex items-center justify-center rounded-full 
             transition-all hover:shadow-md 
             min-w-[100px] sm:min-w-[120px] md:min-w-[140px] 
             w-[100px] sm:w-[120px] md:w-[140px] 
             h-[120px] sm:h-[140px] md:h-[160px] 
             scale-100 hover:scale-110 duration-300 ease-in-out"
      >
        <ImageCompo
          src={image}
          alt={title}
          className="w-full h-full object-contain"
        />
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
