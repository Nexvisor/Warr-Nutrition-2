import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["ik.imagekit.io"],
  },
};

export default withNextVideo(nextConfig);
