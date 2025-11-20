// app/home/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {MapPin, Home, Building, Star, Shield, DollarSign, Badge} from 'lucide-react';

import { publicApartmentAPI, publicApartmentRoomAPI } from '@/app/(consumer)/api';
import { ApartmentRequest } from "@/app/landlord/apartments/type/apartment";
import { ApartmentRoomRequest } from "@/app/landlord/rooms/type/apartment";

export default function HomePage() {
    const [apartments, setApartments] = useState<ApartmentRequest[]>([]);
    const [rooms, setRooms] = useState<ApartmentRoomRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [apartmentsData, roomsData] = await Promise.all([
                publicApartmentAPI.list(),
                publicApartmentRoomAPI.list()
            ]);
            setApartments(apartmentsData);
            setRooms(roomsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

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
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-background border-b sticky top-0 z-50 backdrop-blur-sm bg-background/95">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                                <Home className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                                HomeStay
                            </h1>
                        </div>
                        <nav className="flex space-x-8">
                            <Link href="/" className="text-foreground font-medium hover:text-primary transition-colors relative group">
                                Trang chủ
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </Link>
                            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                                Giới thiệu
                            </Link>
                            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                                Liên hệ
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 relative">
                    <div className="text-center space-y-8 max-w-4xl mx-auto">
                        <div className="space-y-4">
                            <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold">
                                🎯 Nền tảng tìm nhà số 1 Việt Nam
                            </Badge>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                                Tìm Ngôi Nhà
                                <span className="block bg-gradient-to-br from-white to-white/80 bg-clip-text text-transparent">
                  Hoàn Hảo
                </span>
                            </h1>
                            <p className="text-xl md:text-2xl text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
                                Khám phá hàng ngàn căn hộ và phòng trọ chất lượng với giá cả minh bạch
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 pt-8">
                            <Button size="lg" variant="secondary" className="text-base px-8 py-3 h-auto rounded-2xl shadow-lg">
                                <Building className="w-5 h-5 mr-2" />
                                Bắt đầu tìm kiếm
                            </Button>
                            <Button size="lg" variant="outline" className="text-base px-8 py-3 h-auto rounded-2xl border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                                Xem tất cả
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-muted/30 py-16 border-y">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-2">
                            <div className="text-3xl md:text-4xl font-bold text-primary">{apartments.length}+</div>
                            <p className="text-muted-foreground font-medium">Căn hộ nguyên căn</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl md:text-4xl font-bold text-primary">{rooms.length}+</div>
                            <p className="text-muted-foreground font-medium">Phòng trọ</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl md:text-4xl font-bold text-primary">99%</div>
                            <p className="text-muted-foreground font-medium">Khách hàng hài lòng</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
                {/* Apartments Section */}
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
                                <Card key={apartment.uid} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary/20">
                                    <div className="relative h-48 bg-muted overflow-hidden">
                                        {apartment.images && apartment.images.length > 0 ? (
                                            <Image
                                                src={apartment.images[0]}
                                                alt={apartment.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
                                                <Home className="w-12 h-12" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute top-3 right-3">
                                            <Badge variant={getStatusVariant(apartment.status)} className="shadow-lg">
                                                {getStatusText(apartment.status)}
                                            </Badge>
                                        </div>
                                        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <span className="flex-1 line-clamp-2">{getFullAddress(apartment)}</span>
                                        </div>
                                    </CardContent>

                                    <CardFooter>
                                        <Button className="w-full group/btn" size="sm">
                      <span className="group-hover/btn:translate-x-1 transition-transform">
                        Xem chi tiết
                      </span>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                                <div className="p-4 bg-muted rounded-full">
                                    <Building className="w-12 h-12 text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold">Không có căn hộ nào</h3>
                                    <p className="text-muted-foreground max-w-md">
                                        Hiện chưa có căn hộ nào được đăng tải. Hãy quay lại sau để xem các căn hộ mới!
                                    </p>
                                </div>
                                <Button variant="outline" onClick={fetchData}>
                                    Tải lại trang
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Rooms Section */}
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <Badge variant="outline" className="px-4 py-2 text-base">
                            🛏️ Phòng trọ
                        </Badge>
                        <h2 className="text-4xl font-bold tracking-tight">Giải pháp linh hoạt</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            {rooms.length} phòng trọ tiện nghi, phù hợp cho sinh viên và người đi làm
                        </p>
                    </div>

                    {rooms.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {rooms.map((room) => (
                                <Card key={room.uid} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-500/20">
                                    <div className="relative h-48 bg-muted overflow-hidden">
                                        {room.images && room.images.length > 0 ? (
                                            <Image
                                                src={room.images[0]}
                                                alt={room.description}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
                                                <Home className="w-12 h-12" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute top-3 right-3">
                                            <Badge variant={getStatusVariant(room.status)} className="shadow-lg">
                                                {getStatusText(room.status)}
                                            </Badge>
                                        </div>
                                        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Badge variant="secondary" className="backdrop-blur-sm">
                                                {room.areaLength * room.areaWidth}m²
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg text-green-600">Phòng trọ</CardTitle>
                                        <CardDescription className="line-clamp-2">
                                            {room.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="pb-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="text-2xl font-bold text-green-600">
                                                {formatPrice(room.price)}
                                                <span className="text-sm font-normal text-muted-foreground">/tháng</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <span className="flex-1 line-clamp-2">{getFullAddress(room)}</span>
                                        </div>
                                    </CardContent>

                                    <CardFooter>
                                        <Button className="w-full group/btn" size="sm" variant="outline">
                      <span className="group-hover/btn:translate-x-1 transition-transform">
                        Xem chi tiết
                      </span>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                                <div className="p-4 bg-muted rounded-full">
                                    <Home className="w-12 h-12 text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold">Không có phòng trọ nào</h3>
                                    <p className="text-muted-foreground max-w-md">
                                        Hiện chưa có phòng trọ nào được đăng tải. Hãy quay lại sau để xem các phòng trọ mới!
                                    </p>
                                </div>
                                <Button variant="outline" onClick={fetchData}>
                                    Tải lại trang
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-gradient-to-br from-muted/50 to-background py-20 border-y">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-16">
                        <Badge variant="outline" className="px-4 py-2 text-base">
                            ✨ Tại sao chọn chúng tôi?
                        </Badge>
                        <h2 className="text-4xl font-bold tracking-tight">Trải nghiệm khác biệt</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Những lý do khiến HomeStay trở thành lựa chọn hàng đầu
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="text-center border-0 shadow-lg bg-background/50 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                            <CardContent className="pt-8 pb-8">
                                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                                    <Shield className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">An toàn & Bảo mật</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Tất cả thông tin đều được xác thực và bảo mật tuyệt đối
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="text-center border-0 shadow-lg bg-background/50 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                            <CardContent className="pt-8 pb-8">
                                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                                    <DollarSign className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Giá cả minh bạch</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Không có chi phí ẩn, giá cả công khai rõ ràng từ đầu
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="text-center border-0 shadow-lg bg-background/50 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                            <CardContent className="pt-8 pb-8">
                                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                                    <Star className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Chất lượng đảm bảo</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Tất cả bất động sản đều được kiểm duyệt chất lượng kỹ lưỡng
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-muted border-t">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                    <Home className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-bold text-lg">HomeStay</span>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Nền tảng tìm kiếm nhà ở hàng đầu Việt Nam, kết nối người tìm nhà với những không gian sống hoàn hảo.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Liên kết</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Trang chủ</Link></li>
                                <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">Giới thiệu</Link></li>
                                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Liên hệ</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Hỗ trợ</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">Trợ giúp</Link></li>
                                <li><Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
                                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Bảo mật</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Liên hệ</h4>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p>📧 contact@homestay.com</p>
                                <p>📞 1800-1234</p>
                                <p>🏢 Hà Nội, Việt Nam</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
                        <p>&copy; 2024 HomeStay. Tất cả quyền được bảo lưu.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}