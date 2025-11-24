"use client"

import React, { useState } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
    LayoutDashboard,
    Gift,
    Users,
    Settings,
    Bell,
    Search,
} from "lucide-react"
import AdminGuard from "@/app/admin/middleWare/admin-guard"
import LeftBar from "@/app/components/layout/LeftBar";

export default function AdminLayout({
                                        children,
                                    }: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(true)

    if (pathname.startsWith("/admin/passport")) {
        return <>{children}</>
    }

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
        { icon: Gift, label: "Rewards", path: "/admin/reward" },
        { icon: Users, label: "Users", path: "/admin/users" },
        { icon: Settings, label: "Cài đặt", path: "/admin/settings" },
    ]

    return (
        <AdminGuard>
            <div className="flex flex-col h-screen bg-gray-50 text-gray-800">
                {/* HEADER */}
                <header className="w-full bg-white border-b z-30 sticky top-0">
                    <div className="h-18 relative flex items-center justify-between px-6">
                        {/* LOGO */}
                        <div className="flex items-center space-x-3">
                            <Image
                                src="/logo.svg"
                                alt="MyBranding Logo"
                                width={100}
                                height={100}
                                priority
                            />
                        </div>

                        {/* SEARCH BAR */}
                        <div className="flex-1 max-w-md mx-6 hidden md:flex">
                            <div className="relative w-full">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <Search size={16} />
                </span>
                                <input
                                    type="search"
                                    placeholder="Tìm kiếm..."
                                    className="w-full pl-10 pr-4 py-2 rounded-md border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* NOTIFICATIONS + AVATAR */}
                        <div className="flex items-center space-x-3">
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
                </header>

                {/* MAIN ROW: sidebar + content */}
                <div className="flex flex-1 overflow-hidden">
                    <LeftBar
                        isOpen={isOpen}
                        toggleSidebar={() => setIsOpen(!isOpen)}
                        menuItems={[
                            { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
                            { icon: Gift, label: "Rewards", path: "/admin/reward" },
                            { icon: Users, label: "Users", path: "/admin/users" },
                            { icon: Settings, label: "Cài đặt", path: "/admin/settings" },
                        ]}
                        title="Admin Panel"
                    />
                    {/* MAIN CONTENT */}
                    <main className="flex-1 overflow-auto p-5 bg-gray-50">
                        <div className="w-full mx-auto">{children}</div>
                    </main>
                </div>
            </div>
        </AdminGuard>
    )
}
