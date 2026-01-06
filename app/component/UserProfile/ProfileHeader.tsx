"use client";

import { Button } from "@/components/ui/button";
import { LogOut, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSignOut } from "@/hooks/SignOutHandler";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { RootState } from "@/utils/store";

export default function ProfileHeader() {
  const signOutHandler = useSignOut();
  const userInfo = useSelector((state: RootState) => state.dataSlice.userInfo);
  const pathname = usePathname();

  return (
    <div className="space-y-6 py-3">
      {/* HEADER */}
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Back Button */}
        <Link
          href="/"
          className="group inline-flex items-center text-white absolute -top-10 hover:text-white/80 transition"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition" />
          Back to Home
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-white">My Account</h1>
          <p className="text-rose-100 mt-1">
            Welcome back , {userInfo.username || ""}
          </p>
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          className="bg-transparent border-white text-white hover:bg-white hover:text-rose-700 transition"
          onClick={signOutHandler}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* TABS */}
      <div className="border-b border-white/30">
        <div className="flex gap-10 py-4 text-lg font-medium text-white">
          {/* Profile Tab */}
          <TabLink
            href="/account"
            label="Profile"
            active={pathname === "/account"}
          />

          {/* Orders Tab */}
          <TabLink
            href="/account/order"
            label="My Orders"
            active={pathname.startsWith("/account/order")}
          />
        </div>
      </div>
    </div>
  );
}

/* Small helper component for tabs */
function TabLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative cursor-pointer transition group ${
        active ? "text-white font-semibold" : "text-white/80"
      }`}
    >
      {label}

      {/* Underline Animation */}
      <span
        className={`absolute left-0 -bottom-1 h-[2px] bg-white transition-all duration-300 ${
          active ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </Link>
  );
}
