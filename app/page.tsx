"use client";
import Navbar from "@/app/component/Navbar/Navbar";
import { HeroSection } from "@/app/component/HeroSection/HeroSection";
import { CategorySection } from "@/app/component/CategorySection/CategorySection";
import NewProductSection from "./component/NewProducts/NewProductSection";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/store";
import Loader from "./component/Loader";
import Footer from "./component/Footer/Footer";
import Difference from "./component/Difference/Difference";
import VideoSection from "./component/VideoSection/VideoSection";
import Products from "./component/Products/Products";
import Testimonial from "./component/Testimonial/Testimonial";
import BrandSection from "./component/BrandSection/BrandSection";
import WhyWarr from "./component/WhyWarr/WhyWarr";
import ChooseWarr from "./component/ChooseWarr/ChooseWarr";
import ImageTestimonial from "./component/Testimonial/ImageTestimonial";
export default function Home() {
  const isLoading = useSelector(
    (state: RootState) => state.dataSlice.isLoading
  );
  if (isLoading) {
    <Loader />;
  }

  return (
    <div className="bg-gray-50 flex flex-col gap-5">
      <div className="container mx-auto flex flex-col gap-5 ">
        <Navbar />
        <HeroSection />
        <CategorySection />
        <NewProductSection />
      </div>
      <VideoSection />

      <div className="container mx-auto flex flex-col gap-5">
        <Products />
      </div>
      <ImageTestimonial />
      <div className="container mx-auto flex flex-col gap-10">
        <Difference />
      </div>

      <Testimonial />
      {/* <div className="container mx-auto flex flex-col gap-10">
        <BrandSection />
      </div> */}

      <div className="container mx-auto flex flex-col gap-5">
        <WhyWarr />
        <ChooseWarr />
      </div>
      <Footer />
    </div>
  );
}
