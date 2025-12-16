'use client'

import { MapPin, Calendar, DollarSign, Home, FileText, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

export default function MyHomesPage() {
    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-lg">
                        <Home className="w-8 h-8 text-primary" />
                    </div>
                    Nhà của tôi
                </h1>
                <p className="text-gray-600">Quản lý và theo dõi tất cả hợp đồng thuê nhà của bạn</p>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-blue-600 font-semibold uppercase">Hợp đồng</p>
                            <p className="text-2xl font-bold text-blue-900">-</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-green-600 font-semibold uppercase">Hoạt động</p>
                            <p className="text-2xl font-bold text-green-900">-</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-xs text-orange-600 font-semibold uppercase">Tổng tiền</p>
                            <p className="text-2xl font-bold text-orange-900">-</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* WELCOME MESSAGE */}
            <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl p-8 border border-primary/20">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/20 rounded-lg mt-1">
                        <AlertCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Chào mừng đến với Quản lý Nhà Của Tôi</h3>
                        <p className="text-gray-600 leading-relaxed mb-3">
                            Chọn một hợp đồng, liên hệ hoặc khoản thanh toán từ danh sách bên trái để xem chi tiết đầy đủ thông tin.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <strong>Liên hệ:</strong> Xem thông tin chủ nhà và căn hộ
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <strong>Hợp đồng:</strong> Quản lý chi tiết hợp đồng thuê nhà
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <strong>Thanh toán:</strong> Theo dõi lịch sử thanh toán tiền thuê
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* FEATURES GRID */}
            <div className="grid grid-cols-2 gap-4">
                <div className="group hover:shadow-md transition-shadow rounded-lg p-4 border border-gray-200 hover:border-primary/30 bg-white">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 group-hover:bg-blue-200 rounded-lg transition-colors">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Hợp đồng Hoạt động</h4>
                    </div>
                    <p className="text-sm text-gray-600">Những hợp đồng hiện đang có hiệu lực</p>
                </div>

                <div className="group hover:shadow-md transition-shadow rounded-lg p-4 border border-gray-200 hover:border-primary/30 bg-white">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 group-hover:bg-green-200 rounded-lg transition-colors">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Thanh toán Đã thanh toán</h4>
                    </div>
                    <p className="text-sm text-gray-600">Các khoản thanh toán đã hoàn tất</p>
                </div>

                <div className="group hover:shadow-md transition-shadow rounded-lg p-4 border border-gray-200 hover:border-primary/30 bg-white">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-100 group-hover:bg-orange-200 rounded-lg transition-colors">
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Chờ duyệt</h4>
                    </div>
                    <p className="text-sm text-gray-600">Hợp đồng đang chờ xác nhận</p>
                </div>

                <div className="group hover:shadow-md transition-shadow rounded-lg p-4 border border-gray-200 hover:border-primary/30 bg-white">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 group-hover:bg-purple-200 rounded-lg transition-colors">
                            <DollarSign className="w-5 h-5 text-purple-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Tổng Tiền Thuê</h4>
                    </div>
                    <p className="text-sm text-gray-600">Tổng chi phí hàng tháng</p>
                </div>
            </div>
        </div>
    )
}
