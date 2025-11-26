
"use client";


import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {MapPin, Home, Building, Badge, LogIn} from 'lucide-react';


import { ApartmentRequest } from "@/app/landlord/apartments/type/apartment";
import { ApartmentRoomRequest } from "@/app/landlord/rooms/type/apartment";
import {useAppSelector} from "@/store";
import Link from "next/link";

interface ApartmentsSectionProps {
    apartments: ApartmentRequest[];
    loading?: boolean; 
}
const getStatusVariant = (status: string) => {
    switch (status) {
        case 'available': return 'default';
        case 'rented': return 'secondary';
        case 'maintenance': return 'destructive';
        default: return 'outline';
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'available': return 'Có sẵn';
        case 'rented': return 'Đã thuê';
        case 'maintenance': return 'Bảo trì';
        default: return status;
    }
};
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
    }).format(price);
};

const getFullAddress = (item: ApartmentRequest | ApartmentRoomRequest) => {
    if ('province' in item && item.province && item.ward) {
        return `${item.metaData || ''}, ${item.ward.name}, ${item.province.name}`;
    }
    return item.addressDetail || 'Đang cập nhật';
};


export default function ApartmentsSection({ apartments, loading = false }: ApartmentsSectionProps) {
    const { isLoggedIn, userType } = useAppSelector((state) => ({
        isLoggedIn: state.auth.isLoggedIn,
        userType: state.auth.userType
    }));

    const isConsumer = isLoggedIn && userType === 'consumer';

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-muted-foreground">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <Badge variant="outline" className="px-4 py-2 text-base">
                    🏠 Căn hộ nguyên căn
                </Badge>
                <h2 className="text-4xl font-bold tracking-tight">Không gian sống hoàn hảo</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    {apartments.length} căn hộ cao cấp với đầy đủ tiện nghi, sẵn sàng đón bạn
                </p>
            </div>

            {apartments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {apartments.map((apartment) => (
                        <Card key={apartment.uid}
                              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary/20">
                            <div className="relative h-48 bg-muted overflow-hidden">
                                {apartment.images && apartment.images.length > 0 && apartment.images[0] ? (
                                    <Image
                                        src={apartment.images[0]}
                                        alt={apartment.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                ) : (
                                    <div
                                        className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
                                        <Home className="w-12 h-12"/>
                                    </div>
                                )}
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                                <div className="absolute top-3 right-3">
                                    <Badge variant={getStatusVariant(apartment.status)} className="shadow-lg">
                                        {getStatusText(apartment.status)}
                                    </Badge>
                                </div>
                                <div
                                    className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Badge variant="secondary" className="backdrop-blur-sm">
                                        {apartment.areaLength * apartment.areaWidth}m²
                                    </Badge>
                                </div>
                            </div>

                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                    {apartment.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {apartment.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="pb-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold text-primary">
                                        {formatPrice(apartment.price)}
                                        <span className="text-sm font-normal text-muted-foreground">/tháng</span>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0"/>
                                    <span className="flex-1 line-clamp-2">{getFullAddress(apartment)}</span>
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-col gap-2">
                                <Button className="w-full group/btn" size="sm">
                                    <span className="group-hover/btn:translate-x-1 transition-transform">
                                        Xem chi tiết
                                    </span>
                                </Button>

                                {isConsumer ? (
                                    <Button className="w-full group/btn" size="sm" variant="outline">
                                        <span className="group-hover/btn:translate-x-1 transition-transform">
                                            Tham gia trọ
                                        </span>
                                    </Button>
                                ) : (
                                    <Link href={"/consumer/passport/login"} className="w-full">
                                        <Button className="w-full group/btn" size="sm" variant="outline">
                                            <LogIn className="w-4 h-4 mr-2" />
                                            <span className="group-hover/btn:translate-x-1 transition-transform">
                                                Đăng nhập để tham gia
                                            </span>
                                        </Button>
                                    </Link>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )  : (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                        <div className="p-4 bg-muted rounded-full">
                            <Building className="w-12 h-12 text-muted-foreground"/>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">Không có căn hộ nào</h3>
                            <p className="text-muted-foreground max-w-md">
                                Hiện chưa có căn hộ nào được đăng tải. Hãy quay lại sau để xem các căn hộ mới!
                            </p>
                        </div>
                        <Button variant="outline" >
                            Tải lại trang
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}