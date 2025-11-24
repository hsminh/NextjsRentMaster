'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Menu, LogOut } from 'lucide-react'

export type MenuItem = {
    icon: React.ElementType
    label: string
    path: string
}

interface SidebarProps {
    isOpen: boolean
    toggleSidebar: () => void
    menuItems: MenuItem[]
    title?: string
    onLogout?: () => void
    userType?: string
}

export default function LeftBar({
                                    isOpen,
                                    toggleSidebar,
                                    menuItems,
                                    title = 'Admin Panel',
                                    onLogout,
                                    userType,
                                }: SidebarProps) {
    const pathname = usePathname()

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
                                {title}
                            </motion.h1>
                        )}
                    </AnimatePresence>
                </div>
                <button
                    type="button"
                    onClick={toggleSidebar}
                    aria-label={isOpen ? 'Đóng sidebar' : 'Mở sidebar'}
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

            {/* LOGOUT BUTTON */}
            {onLogout && (
                <button
                    type="button"
                    onClick={onLogout}
                    className="flex items-center px-4 py-3 mx-2 mb-3 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                >
                    <LogOut size={20} className="text-gray-500" />
                    <AnimatePresence>
                        {isOpen && (
                            <motion.span
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.2 }}
                                className="ml-3"
                            >
                                Đăng xuất
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            )}
        </motion.aside>
    )
}
