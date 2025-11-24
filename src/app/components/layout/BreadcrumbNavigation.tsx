'use client'

import React from 'react';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Home } from 'lucide-react'

interface BreadcrumbItemType {
    label: string
    href?: string
}

export interface BreadcrumbNavigationProps {
    items: BreadcrumbItemType[]
    homeHref?: string
    homeLabel?: string
}

export function BreadcrumbNavigation({
                                         items,
                                         homeHref = "/",
                                         homeLabel = "Trang chủ"
                                     }: BreadcrumbNavigationProps) {
    if (!items.length) return null

    return (
        <Breadcrumb className="mx-5">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href={homeHref} className="flex items-center gap-1">
                        <Home size={16} />
                        {homeLabel}
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {items.map((item, index) => {
                    const isLast = index === items.length - 1

                    return (
                        <React.Fragment key={index}>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage className="text-indigo-600 font-medium border-indigo-600 pl-2">
                                        {item.label}
                                    </BreadcrumbPage>
                                ) : item.href ? (
                                    <BreadcrumbLink
                                        href={item.href}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        {item.label}
                                    </BreadcrumbLink>
                                ) : (
                                    <span className="text-gray-600">{item.label}</span>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </React.Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
