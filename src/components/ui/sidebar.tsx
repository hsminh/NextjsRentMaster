'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, Users, Settings } from 'lucide-react'

export interface SidebarItem {
    href: string
    label: string
    icon?: React.ElementType
}

export default function Sidebar({ items }: { items: SidebarItem[] }) {
    const pathname = usePathname() || ''

    return (
        <aside className="w-64 `bg`-white border-r border-gray-200 h-screen sticky top-0">
            <div className="p-4">
                <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">
                    Trung tâm công việc
                </h2>

                <nav className="flex flex-col gap-1" aria-label="Sidebar">
                    {items.map((item) => {
                        const Icon = item.icon || Home
                        const active =
                            pathname === item.href ||
                            pathname.startsWith(item.href + '/') ||
                            (item.href !== '/' && pathname.startsWith(item.href))

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                    'group flex items-center gap-3 px-3 py-2 text-sm font-medium transition-all border-l-4',
                                    active
                                        ? 'border-green-600 text-green-600 bg-transparent'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-transparent hover:border-gray-200'
                                )}
                            >
                                <Icon
                                    className={cn(
                                        'h-5 w-5 transition-colors',
                                        active ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'
                                    )}
                                />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </aside>
    )
}
