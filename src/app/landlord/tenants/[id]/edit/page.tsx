'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {Loader2, Check, X, Ban, Home, DollarSign, Text, Ruler, MapPin, UserCheck, Clock, Badge} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TenantAPI } from "@/app/landlord/tenants/api"
import { TenantRequest } from "@/app/landlord/tenants/type/tenant"
import ctoast from "@/components/ui/Toast"
import { BreadcrumbNavigation } from "@/app/components/layout/BreadcrumbNavigation"
import { tenantEditBreadcrumb } from "@/app/landlord/tenants/use/use-tenant-data"

interface RealEstateUnit {
    title?: string;
    RoomNumber?: string;
    price?: number;
    areaLength?: number;
    areaWidth?: number;
}

type ActionStatus = 'Accepted' | 'Rejected' | 'Cancelled';

export default function ConfirmConsumerContactPage() {
    const params = useParams()
    const router = useRouter()
    const contactUid = Array.isArray(params.id) ? params.id[0] : params.id as string

    const [contact, setContact] = useState<TenantRequest | null>(null)
    const [loading, setLoading] = useState(true)
    const [isUpdating, setIsUpdating] = useState(false)
    const [updatingStatus, setUpdatingStatus] = useState<ActionStatus | null>(null);
    const [error, setError] = useState<string | null>(null)

    const fetchContact = async () => {
        if (!contactUid) return

        setLoading(true)
        setError(null)
        try {
            const api = new TenantAPI()
            const data = await api.detail(contactUid)
            setContact(data)
        } catch (err: any) {
            console.error('Failed to fetch contact:', err)
            setError(err.message || 'Không thể tải thông tin yêu cầu')
            ctoast.error('Không thể tải thông tin yêu cầu')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchContact()
    }, [contactUid])

    const handleUpdateStatus = async (status: ActionStatus) => {
        if (!contactUid || !contact) return;

        setUpdatingStatus(status);
        setIsUpdating(true);
        try {
            const api = new TenantAPI();
            const result = await api.update(contactUid, {
                status: status === 'Accepted' ? 'Approved' : 'Rejected'
            });
            setContact(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    status: status,
                    uid: prev.uid,
                    type: prev.type
                };
            });

            ctoast.success(`Yêu cầu đã được ${status === 'Accepted' ? 'chấp nhận' : 'từ chối'}.`);
        } catch (err: any) {
            console.error('Failed to update status:', err);
            ctoast.error(err.message || 'Cập nhật trạng thái thất bại');
        } finally {
            setIsUpdating(false);
            setUpdatingStatus(null);
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Accepted':
                return 'bg-green-600 hover:bg-green-700';
            case 'Rejected':
                return 'bg-red-600 hover:bg-red-700';
            case 'Pending':
                return 'bg-yellow-500 hover:bg-yellow-600';
            default:
                return 'bg-gray-500 hover:bg-gray-600';
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin"/>
        </div>
    )

    if (error) return (
        <div className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600">Lỗi tải dữ liệu</h2>
            <p className="text-red-500 mt-2">{error}</p>
            <Button onClick={() => router.push('/landlord/tenants')} variant="outline" className="mt-4">
                Quay lại danh sách
            </Button>
        </div>
    )

    if (!contact) return (
        <div className="text-center py-12">
            <h2 className="text-xl font-semibold">Không tìm thấy yêu cầu</h2>
            <p className="text-muted-foreground mt-2">
                Yêu cầu bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <Button onClick={() => router.push('/landlord/tenants')} variant="outline" className="mt-4">
                Quay lại danh sách
            </Button>
        </div>
    )

    const isPending = contact.status === 'Pending'
    const unit: RealEstateUnit = contact.realEstateUnit || {}

    const unitTitle = unit.title || (unit.RoomNumber ? `Phòng số ${unit.RoomNumber}` : 'Chưa rõ');

    const consumerName = `${contact.consumer?.firstName || ''} ${contact.consumer?.lastName || ''}`.trim() || 'Người dùng ẩn danh';

    const consumerInfo = [
        {icon: UserCheck, label: "Tên người liên hệ", value: consumerName},
        {icon: Clock, label: "Thời gian gửi", value: new Date(contact.createdAt).toLocaleDateString('vi-VN')},
        {icon: MapPin, label: "UID Yêu cầu", value: contact.uid, small: true},
    ];

    const unitInfo = [
        {icon: Home, label: "Loại BĐS", value: contact.type},
        {icon: Text, label: "Tiêu đề", value: unitTitle},
        {icon: DollarSign, label: "Giá đề xuất", value: unit.price ? `${unit.price.toLocaleString()} VND` : 'N/A'},
        {
            icon: Ruler,
            label: "Diện tích",
            value: unit.areaLength && unit.areaWidth ? `${unit.areaLength} x ${unit.areaWidth} m²` : 'N/A'
        },
    ];


    return (
        <div className="min-h-full space-y-6 max-w-4xl mx-auto py-8">
            <BreadcrumbNavigation {...tenantEditBreadcrumb} />

            <Card className="shadow-lg">
                <CardHeader className="border-b">
                    <CardTitle className="text-3xl font-bold text-gray-800">
                        Xác nhận Yêu cầu Tham gia Trọ
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-2 pt-1">
                        <span className="text-md">Từ: <strong>{consumerName}</strong></span>
                        <Badge className={getStatusBadgeClass(contact.status)}>
                            {contact.status}
                        </Badge>
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-6 space-y-8">

                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold border-b pb-2 text-gray-700">Chi tiết Người liên hệ</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {consumerInfo.map((item) => (
                                <div key={item.label} className="flex items-center space-x-3">
                                    <item.icon className="w-5 h-5 text-blue-500"/>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{item.label}:</p>
                                        <p className={`text-md font-semibold text-gray-800 ${item.small ? 'text-xs break-all' : ''}`}>{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        <h3 className="text-xl font-semibold border-b pb-2 text-gray-700">Chi tiết Bất động sản</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {unitInfo.map((item) => (
                                <div key={item.label} className="flex items-center space-x-3">
                                    <item.icon className="w-5 h-5 text-indigo-500"/>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{item.label}:</p>
                                        <p className="text-md font-semibold text-gray-800">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    {isPending ? (
                        <div className="pt-8 border-t mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                            <Button
                                onClick={() => handleUpdateStatus('Accepted')}
                                disabled={isUpdating}
                                className="bg-green-600 hover:bg-green-700 text-lg px-6 py-3"
                            >
                                {updatingStatus === 'Accepted' ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> :
                                    <Check className="mr-2 h-5 w-5"/>}
                                Đồng ý (Chấp nhận)
                            </Button>
                            <Button
                                onClick={() => handleUpdateStatus('Rejected')}
                                disabled={isUpdating}
                                variant="destructive"
                                className="text-lg px-6 py-3"
                            >
                                {updatingStatus === 'Rejected' ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> :
                                    <X className="mr-2 h-5 w-5"/>}
                                Từ chối
                            </Button>
                            <Button
                                onClick={() => handleUpdateStatus('Cancelled')}
                                disabled={isUpdating}
                                variant="outline"
                                className="text-lg px-6 py-3"
                            >
                                {updatingStatus === 'Cancelled' ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> :
                                    <Ban className="mr-2 h-5 w-5"/>}
                                Hủy bỏ
                            </Button>
                        </div>
                    ) : (
                        <div className="pt-6 border-t mt-6 text-center bg-gray-50 p-4 rounded-lg">
                            <p className="text-md font-medium text-gray-700">
                                Yêu cầu đã được xử lý vào
                                ngày {new Date(contact.createdAt).toLocaleDateString('vi-VN')}.
                            </p>
                            <Button
                                onClick={() => router.push('/landlord/tenants')}
                                variant="secondary"
                                className="mt-4"
                            >
                                Quay lại danh sách
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}