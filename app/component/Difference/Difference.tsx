import React from "react";
import BrandDifference from "@/public/Warr/warrVSOther.svg";
import { ImageCompo } from "@/app/component/comman/ImageCompo";

function Difference() {
  return (
    <div className="flex justify-center items-center w-full  p-4 md:p-0">
      <ImageCompo
        src={BrandDifference}
        alt="WarrVsOther"
        className="object-contain"
        width={1200}
        height={600}
      />
    </div>
  );
}

export default Difference;
