'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/ui/sidebar'

export default function LeftBar() {
  const pathname = usePathname() || ''

  const items = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/settings', label: 'Settings' },
  ]

  return <Sidebar items={items} />
}
