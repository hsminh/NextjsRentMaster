'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard,
    Gift,
    Users,
    Settings,
    ChevronLeft,
    Menu,
} from 'lucide-react'

interface SidebarProps {
    isOpen: boolean
    toggleSidebar: () => void
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
    const pathname = usePathname()
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Gift, label: 'Rewards', path: '/admin/reward' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: Settings, label: 'Cài đặt', path: '/admin/settings' },
    ]

    return (
        <motion.aside
            animate={{ width: isOpen ? 220 : 70 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-r shadow-sm flex flex-col"
        >
            {/* HEADER */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="flex items-center space-x-2 overflow-hidden">
                    <AnimatePresence>
                        {isOpen && (
                            <motion.h1
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="font-bold text-lg text-gray-800 truncate"
                            >
                                Admin Panel
                            </motion.h1>
                        )}
                    </AnimatePresence>
                </div>
                <button
                    onClick={toggleSidebar}
                    className="p-1 rounded hover:bg-gray-100"
                >
                    {isOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
                </button>
            </div>

            {/* MENU ITEMS */}
            <nav className="flex-1 py-3 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const active = pathname.startsWith(item.path)
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center px-4 py-2 rounded-md mx-2 transition-all ${
                                active
                                    ? 'text-indigo-600 font-medium border-l-4 border-indigo-600'
                                    : 'hover:bg-gray-100 text-gray-700'
                            }`}
                            aria-current={active ? 'page' : undefined}
                        >
                            <Icon
                                size={22}
                                className={active ? 'text-indigo-600' : 'text-gray-400'}
                            />
                            <AnimatePresence>
                                {isOpen && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -8 }}
                                        transition={{ duration: 0.2 }}
                                        className="ml-3 text-sm truncate"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    )
                })}
            </nav>
        </motion.aside>
    )
}
