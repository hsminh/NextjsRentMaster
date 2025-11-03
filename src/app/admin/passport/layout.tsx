'use client'

import React from 'react'

export default function PassportLayout({
                                           children,
                                       }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-black">
            <div className="w-full max-w-md px-6 py-8 bg-white dark:bg-neutral-900 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-neutral-200/70 dark:border-neutral-800/70 transition-all duration-300">
                {children}
            </div>
        </div>
    )
}
