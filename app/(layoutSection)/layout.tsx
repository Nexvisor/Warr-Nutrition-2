import React from "react";
import Navbar from "@/app/component/Navbar/Navbar";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

export default RootLayout;
