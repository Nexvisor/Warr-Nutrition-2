import React from "react";
import ProfileHeader from "@/app/component/UserProfile/ProfileHeader";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="w-full bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 text-white shadow-lg">
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <ProfileHeader />
        </div>
      </div>

      {/* Content Wrapper */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-xl shadow-md p-5 sm:p-8">
          {children}
        </div>
      </div>

      {/* Footer or space bottom */}
      <div className="h-10"></div>
    </div>
  );
}
