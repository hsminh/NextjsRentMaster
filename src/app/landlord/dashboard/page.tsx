'use client'

import React from 'react'
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {Home, Users, DoorOpen, UserPlus, Bell, Building2, TrendingUp, Calendar, Badge} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

import CLoading from "@/components/ui/CLoading";


const mockData = {
    totalProperties: 50,
    rentedProperties: 35,
    totalRooms: 120,
    totalTenants: 85,
    tenantGrowth: [
        { month: '01-2025', total: 70, new: 10 },
        { month: '02-2025', total: 75, new: 5 },
        { month: '03-2025', total: 78, new: 3 },
        { month: '04-2025', total: 80, new: 2 },
        { month: '05-2025', total: 82, new: 2 },
        { month: '06-2025', total: 85, new: 3 },
    ],
    rentalTrend: [
        { month: '01-2025', total: 50, rented: 30 },
        { month: '02-2025', total: 50, rented: 32 },
        { month: '03-2025', total: 50, rented: 33 },
        { month: '04-2025', total: 50, rented: 34 },
        { month: '05-2025', total: 50, rented: 34 },
        { month: '06-2025', total: 50, rented: 35 },
    ],
    recentRentals: [
        { id: 1, name: 'Trọ A1 - 123 Nguyễn Huệ', rooms: 3, tenants: 2, status: 'rented', rent: '6.5 triệu' },
        { id: 2, name: 'Trọ B2 - 45 Lê Lợi', rooms: 2, tenants: 1, status: 'available', rent: '4.2 triệu' },
        { id: 3, name: 'Trọ C3 - 78 Trần Phú', rooms: 4, tenants: 4, status: 'rented', rent: '8.0 triệu' },
        { id: 4, name: 'Trọ D4 - 56 Hùng Vương', rooms: 2, tenants: 0, status: 'available', rent: '3.8 triệu' },
    ],
}

const chartTenantConfig: ChartConfig = {
    total: { label: 'Tổng người thuê', color: 'hsl(173, 58%, 39%)' },
    new: { label: 'Người thuê mới', color: 'hsl(12, 76%, 61%)' },
}

const chartRentalConfig: ChartConfig = {
    total: { label: 'Tổng trọ', color: 'hsl(173, 58%, 39%)' },
    rented: { label: 'Đã thuê', color: 'hsl(12, 76%, 61%)' },
}

export default function LandlordDashboard() {
    const isLoading = false // set true để test skeleton

    const formatMonth = (value: string) => {
        const monthNum = value.split('-')[0]
        const months = [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
        ]
        return months[Number(monthNum) - 1]
    }

    const getStatusBadge = (status: string) => {
        return status === 'rented' ? (
            <Badge className="bg-green-500 text-white">Đã thuê</Badge>
        ) : (
            <Badge >Trống</Badge>
        )
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý nhà trọ</h1>
                    <p className="text-muted-foreground">Theo dõi hiệu suất cho thuê và tình trạng phòng trọ</p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                    <Calendar className="h-4 w-4" />
                    Cập nhật 5 phút trước
                </button>
            </div>

            {/* Stats Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <CLoading key={i}  />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tổng số trọ</CardTitle>
                            <Building2 className="h-5 w-5 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockData.totalProperties}</div>
                            <p className="text-xs text-muted-foreground">Tổng số nhà trọ</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Đã cho thuê</CardTitle>
                            <Home className="h-5 w-5 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockData.rentedProperties}</div>
                            <p className="text-xs text-muted-foreground">
                                {((mockData.rentedProperties / mockData.totalProperties) * 100).toFixed(0)}% đang cho thuê
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Người đang thuê</CardTitle>
                            <Users className="h-5 w-5 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockData.totalTenants}</div>
                            <p className="text-xs text-muted-foreground">Người đang ở</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tổng số phòng</CardTitle>
                            <DoorOpen className="h-5 w-5 text-pink-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockData.totalRooms}</div>
                            <p className="text-xs text-muted-foreground">Tổng số phòng</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Charts & Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Rentals Table */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Trọ gần đây
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-full">Tên trọ</TableHead>
                                    <TableHead>Phòng</TableHead>
                                    <TableHead>Người</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockData.recentRentals.map((rental) => (
                                    <TableRow key={rental.id}>
                                        <TableCell className="font-medium">
                                            <div className="text-sm">{rental.name}</div>
                                            <div className="text-xs text-muted-foreground">{rental.rent}/tháng</div>
                                        </TableCell>
                                        <TableCell>{rental.rooms}</TableCell>
                                        <TableCell>{rental.tenants}</TableCell>
                                        <TableCell>{getStatusBadge(rental.status)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Tenant Growth Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5" />
                            Tăng trưởng người thuê
                        </CardTitle>
                        <CardDescription>
                            Từ {formatMonth(mockData.tenantGrowth[0].month)} đến {formatMonth(mockData.tenantGrowth[5].month)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartTenantConfig} className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={mockData.tenantGrowth} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" tickFormatter={formatMonth} fontSize={12} />
                                    <Tooltip content={< ChartTooltipContent />} />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        stroke="var(--color-total)"
                                        strokeWidth={2}
                                        dot={{ fill: 'var(--color-total)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="new"
                                        stroke="var(--color-new)"
                                        strokeWidth={2}
                                        dot={{ fill: 'var(--color-new)' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Rental Occupancy Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Home className="h-5 w-5" />
                        Tỷ lệ lấp đầy
                    </CardTitle>
                    <CardDescription>
                        Từ {formatMonth(mockData.rentalTrend[0].month)} đến {formatMonth(mockData.rentalTrend[5].month)}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartRentalConfig} className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockData.rentalTrend} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" tickFormatter={formatMonth} fontSize={12} />
                                <Tooltip content={<ChartTooltipContent />} />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="var(--color-total)"
                                    strokeWidth={2}
                                    dot={{ fill: 'var(--color-total)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="rented"
                                    stroke="var(--color-rented)"
                                    strokeWidth={2}
                                    dot={{ fill: 'var(--color-rented)' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Thông báo
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Bell className="h-12 w-12 text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">Không có thông báo mới</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}