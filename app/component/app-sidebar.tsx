"use client";

import { LayoutGrid, LogOut, Leaf, Users2, ClipboardList } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
// import { useSignOut } from "@/hooks/SignOutHandler";

const navigationItems = [
  {
    title: "Product List",
    url: "/dashboard",
    icon: LayoutGrid,
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: Users2,
  },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: ClipboardList,
  },
];

export function AppSidebar() {
  //   const signOutHandler = useSignOut();
  const pathname = usePathname();

  return (
    <Sidebar className="border-r-0 bg-gray-900 text-white" collapsible="none">
      {/* Header with WARR title */}
      <SidebarHeader className="border-b border-gray-700">
        <div className="flex flex-col font-bold text-white tracking-wide items-center">
          <h1 className="text-3xl ">WARR </h1>
          <h1 className="text-md">Nutrition</h1>
        </div>
      </SidebarHeader>

      {/* Navigation Links */}
      <SidebarContent className="flex-1 p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`hover:bg-gray-800 hover:text-white transition-all duration-200 py-3 px-4 rounded-lg ${
                      pathname === item.url
                        ? "bg-red-700 text-white font-semibold"
                        : "text-gray-400"
                    }`}
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span className="text-base">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Nutrition and Logout */}
      <SidebarFooter className="border-t border-gray-700 p-6 space-y-4">
        {/* Nutrition Label */}
        <div className="flex items-center gap-3 text-white/80">
          <Leaf className="h-5 w-5" />
          <span className="text-base font-medium">Nutrition</span>
        </div>

        {/* Logout Button */}
        <Button
          //   onClick={signOutHandler}
          variant="ghost"
          className="w-full justify-start bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 py-2"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
