"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Gift,
  Users,
  Settings,
  Menu,
  ChevronLeft,
  Bell,
  Search,
} from "lucide-react";
import AdminGuard from "@/app/admin/MiddleWare/admin-guard";
import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  // passport pages (login/register) don't use admin chrome
  if (pathname.startsWith("/admin/passport")) {
    return <>{children}</>;
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Gift, label: "Rewards", path: "/admin/reward" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: Settings, label: "Cài đặt", path: "/admin/settings" },
  ];

  return (
    <AdminGuard>
      {/* Column layout: top header bar, then the main row (aside + content) */}
      <div className="flex flex-col h-screen bg-gray-50 text-gray-800">
        {/* TOP HEADER: full width (sticky) - no shadow per request */}
        <header className="w-full bg-white border-b z-30 sticky top-0">
          {/* use relative header so left/right can be absolutely positioned to corners */}
          <div className="w-full">
            <div className="h-16 relative">
              {/* LEFT group - anchored to left corner (flush) */}
              <div className="absolute left-0 top-0 bottom-0 flex items-center pl-[90px]">
                <Image
                  src="/file.svg"
                  alt="logo"
                  width={36}
                  height={36}
                  className="rounded-sm"
                />
              </div>

              {/* CENTER: search bar - stays centered */}
              <div className="absolute inset-x-0 top-0 bottom-0 flex items-center justify-center px-4">
                <div className="relative max-w-2xl w-full">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Search size={16} />
                  </span>
                  <input
                    type="search"
                    placeholder="Tìm kiếm..."
                    className="w-full pl-10 pr-4 py-2 rounded-md border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* RIGHT group - anchored to right corner (flush) */}
              <div className="absolute right-0 top-0 bottom-0 flex items-center space-x-3 pr-[30px]">
                <div className="hidden sm:flex items-center">
                  <Image
                    src="/file.svg"
                    alt="mini-logo"
                    width={28}
                    height={28}
                    className="rounded-sm"
                  />
                </div>

                <button
                  aria-label="Notifications"
                  className="relative p-2 rounded hover:bg-gray-100"
                >
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    3
                  </span>
                </button>

                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ROW: sidebar (left) + main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT SIDEBAR */}
          <motion.aside
            animate={{ width: isOpen ? 220 : 70 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-r shadow-sm flex flex-col"
          >
            {/* SIDEBAR HEADER (branding & collapse) */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h1 className="font-bold text-lg truncate">
                {isOpen ? "MyBranding" : "MB"}
              </h1>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 rounded hover:bg-gray-200"
              >
                {isOpen ? (
                  <ChevronLeft size={18} />
                ) : (
                  <Menu size={18} />
                )}
              </button>
            </div>

            {/* MENU */}
            <nav className="flex-1 py-3 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center px-4 py-2 rounded-md mx-2 transition-all ${
                      active
                        ? "bg-indigo-100 text-indigo-600 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon size={20} />
                    {isOpen && (
                      <span className="ml-3 text-sm truncate">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </motion.aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 overflow-auto p-5 bg-gray-50">
            {/* allow children to use full width of main area */}
            <div className="w-full mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
