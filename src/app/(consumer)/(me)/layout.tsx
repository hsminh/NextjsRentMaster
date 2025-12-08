'use client'

import { User, Lock, Bell, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const menu = [
        { label: 'Profile', href: '/profile', icon: User },
        { label: 'Security', href: '/security', icon: Lock },
        { label: 'Notifications', href: '/notifications', icon: Bell },
        { label: 'Billing', href: '/billing', icon: CreditCard },
    ]

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">

                {/* LEFT SIDEBAR */}
                <aside className="border rounded-xl p-4 h-fit bg-white shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Account Settings</h2>

                    <ul className="space-y-2 text-sm">
                        {menu.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 p-2 rounded-lg transition hover:bg-muted",
                                            isActive && "bg-primary text-white hover:bg-primary"
                                        )}
                                    >
                                        <Icon size={18} />
                                        {item.label}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </aside>

                <div>{children}</div>
            </div>
        </div>
    )
}
