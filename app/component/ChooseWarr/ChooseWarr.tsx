import Image from "next/image";
import ChooseWarrImg from "@/assets/FooterBanner/FooterBanner.png";

export default function ChooseWarr() {
  return (
    <div className="relative w-full aspect-[16/7] sm:aspect-[16/6] md:aspect-[16/5] lg:aspect-[16/4] xl:aspect-[16/3] overflow-hidden rounded-lg">
      <Image
        src={ChooseWarrImg}
        alt="Choose Warranty"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
    </div>
  );
}
