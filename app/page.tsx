"use client";
import Navbar from "@/app/component/Navbar/Navbar";
import { HeroSection } from "@/app/component/HeroSection/HeroSection";
import { CategorySection } from "@/app/component/CategorySection/CategorySection";
import NewProductSection from "./component/NewProducts/NewProductSection";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/store";
import Loader from "./component/Loader";
export default function Home() {
  const isLoading = useSelector(
    (state: RootState) => state.dataSlice.isLoading
  );
  if (isLoading) {
    <Loader />;
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto flex flex-col gap-5 ">
        <Navbar />
        <HeroSection />
        <CategorySection />
        <NewProductSection />
      </div>
    </div>
  );
}
