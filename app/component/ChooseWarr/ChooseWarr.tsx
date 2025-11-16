import Image from "next/image";
import ChooseWarrDesk from "@/public/FooterBanner/WE_PC.png";
import ChooseWarrMobile from "@/public/FooterBanner/WE_mobile.png";

export default function ChooseWarr() {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Desktop Image */}
      <div className="hidden md:block relative w-full aspect-[16/5]">
        <Image
          src={ChooseWarrDesk}
          alt="Choose Warranty Desktop"
          fill
          sizes="(min-width: 768px) 100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Mobile Image */}
      <div className="block md:hidden relative w-full aspect-[16/8]">
        <Image
          src={ChooseWarrMobile}
          alt="Choose Warranty Mobile"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
