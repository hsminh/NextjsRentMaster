"use client";

import { useEffect, useState } from 'react';
import { useAppSelector } from "@/store";
import { favoriteAPI, FavoriteItem } from '@/app/(consumer)/consumer/api';
import {
    Card,
    CardContent, CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Heart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { ApartmentRequest, ApartmentRoomRequest } from '@/app/landlord/apartments/type/apartment';
import ctoast from "@/components/ui/Toast";

export default function FavoritesPage() {
    const [loading, setLoading] = useState(true);
    const [favoritesData, setFavoritesData] = useState<(FavoriteItem & { apartment?: ApartmentRequest | ApartmentRoomRequest })[]>([]);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    const { isLoggedIn, userType } = useAppSelector((state) => ({
        isLoggedIn: state.auth.isLoggedIn,
        userType: state.auth.userType
    }));

    const isConsumer = isLoggedIn && userType === 'consumer';

    useEffect(() => {
        setMounted(true);
    }, []);

    const fetchFavoritesWithData = async () => {
        try {
            setLoading(true);
            const data = await favoriteAPI.list() as any[];

            const enrichedFavorites = data.map((item: any) => {
                let apartment;
                if (item.type === 'FullApartment' && item.apartment) {
                    apartment = item.apartment;
                } else if (item.type === 'RoomBased' && item.apartmentRoom) {
                    apartment = item.apartmentRoom;
                }
                return { ...item, apartment };
            });
            
            setFavoritesData(enrichedFavorites);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (favoriteUid: string) => {
        try {
            setRemovingId(favoriteUid);
            await favoriteAPI.removeFavorite(favoriteUid);
            setFavoritesData(prev => prev.filter(item => item.uid !== favoriteUid));
            ctoast.success('Đã xóa khỏi yêu thích');
        } catch (error) {
            console.error('Error removing favorite:', error);
            ctoast.error('Có lỗi xảy ra khi xóa');
        } finally {
            setRemovingId(null);
        }
    };

    useEffect(() => {
        if (!isConsumer) return;
        fetchFavoritesWithData();
    }, [isConsumer]);

    if (!mounted) {
        return (
            <div className="flex justify-center items-center py-8 min-h-screen">
                <div className="flex flex-col items-center space-y-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-muted-foreground">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (!isConsumer) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6 text-center space-y-4">
                        <p className="text-lg">Vui lòng đăng nhập để xem danh sách yêu thích</p>
                        <Link href="/consumer/passport/login">
                            <Button className="w-full">Đăng nhập</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8 min-h-screen">
                <div className="flex flex-col items-center space-y-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-muted-foreground">Đang tải dữ liệu yêu thích...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="flex items-center space-x-2 text-primary hover:underline transition-colors">
                        <span className="text-lg">←</span>
                        <span>Về trang chủ</span>
                    </Link>
                </div>
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <Badge variant="outline" className="px-4 py-2 text-base">
                            ❤️ Danh sách yêu thích
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight">Danh sách yêu thích của bạn</h1>
                        <p className="text-xl text-muted-foreground">
                            {favoritesData.length} mục yêu thích đang được lưu
                        </p>
                    </div>

                    {favoritesData.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                                <div className="p-4 bg-muted rounded-full">
                                    <Heart className="w-12 h-12 text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold">
                                        Chưa có mục yêu thích nào
                                    </h3>
                                    <p className="text-muted-foreground max-w-md">
                                        Hãy thêm những căn hộ và phòng trọ yêu thích của bạn để sử dụng sau!
                                    </p>
                                </div>
                                <Link href="/">
                                    <Button variant="outline" className="mt-4">
                                        Khám phá các danh sách
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {favoritesData.map((item: FavoriteItem & { apartment?: ApartmentRequest | ApartmentRoomRequest }) => (
                                <Card
                                    key={item.uid}
                                    className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary/20 hover:scale-105 transform"
                                >
                                    <div className="relative h-64 bg-muted overflow-hidden">
                                        {item.apartment && 'images' in item.apartment && item.apartment.images && item.apartment.images.length > 0 ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img 
                                                src={item.apartment.images[0]} 
                                                alt={item.type} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-primary/10 via-primary/5 to-muted/30">
                                                <div className="text-center">
                                                    {item.type === 'FullApartment' ? (
                                                        <>
                                                            <Home className="w-20 h-20 mx-auto mb-2 text-primary/60 group-hover:text-primary transition-colors" />
                                                            <p className="text-sm text-primary/70">Căn hộ</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Home className="w-20 h-20 mx-auto mb-2 text-primary/60 group-hover:text-primary transition-colors" />
                                                            <p className="text-sm text-primary/70">Phòng trọ</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute top-4 right-4 flex items-center gap-2">
                                            <Badge variant="secondary" className="shadow-lg bg-white/95 text-sm font-semibold">
                                                {item.type === 'FullApartment' ? '🏠 Căn hộ' : '🛏️ Phòng'}
                                            </Badge>
                                            <button
                                                onClick={() => handleRemoveFavorite(item.uid)}
                                                disabled={removingId === item.uid}
                                                className="p-2.5 rounded-full bg-red-100 text-red-500 hover:bg-red-200 shadow-md transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Hủy yêu thích"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg line-clamp-1">
                                            {item.apartment && 'title' in item.apartment 
                                                ? (item.apartment as ApartmentRequest).title 
                                                : item.apartment && 'roomNumber' in item.apartment
                                                ? `Phòng ${(item.apartment as any).roomNumber}`
                                                : item.type === 'FullApartment' ? '🏠 Căn hộ' : '🛏️ Phòng trọ'}
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="pb-4 space-y-3">
                                        {item.apartment && 'price' in item.apartment && (
                                            <div className="text-lg font-bold text-primary">
                                                {(item.apartment.price || 0).toLocaleString('vi-VN')} đ/tháng
                                            </div>
                                        )}
                                    </CardContent>

                                    <CardFooter>
                                        <Link href={`/apartment/${item.type === 'RoomBased' ? item.apartmentRoomUid : item.apartmentUid}/details`} className="w-full">
                                            <Button className="w-full group/btn bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary" size="sm">
                                                <span className="group-hover/btn:translate-x-1 transition-transform">
                                                    Xem chi tiết
                                                </span>
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
