'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar({ items }: { items: { href: string; label: string }[] }) {
  const pathname = usePathname() || ''

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Admin</h2>
        <nav className="space-y-1" aria-label="Sidebar">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/') || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
