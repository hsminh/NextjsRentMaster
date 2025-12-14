"use client";

import { useCallback, useEffect, useState } from 'react';
import Link from "next/link";
import Image from 'next/image';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import {
    MapPin,
    Home,
    Building,
    LogIn
} from 'lucide-react';

import { publicApartmentRoomAPI, contactAPI, favoriteAPI, FavoriteItem } from '@/app/(consumer)/consumer/api';
import { ApartmentRoomRequest } from "@/app/landlord/rooms/type/apartment";
import { useAppSelector } from "@/store";
import ctoast from "@/components/ui/Toast";
import { FavoriteButton } from "@/components/FavoriteButton";

type SharedFilters = {
    minPrice?: number;
    maxPrice?: number;
    wardDivisionUid?: string;
    provinceDivisionUid?: string;
    streetUid?: string;
    provinceName?: string;
};

interface RoomsSectionProps {
    initialRooms: ApartmentRoomRequest[];
    sharedFilters?: SharedFilters;
}

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'available':
            return 'default';
        case 'rented':
            return 'secondary';
        case 'maintenance':
            return 'destructive';
        default:
            return 'outline';
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'available':
            return 'Có sẵn';
        case 'rented':
            return 'Đã thuê';
        case 'maintenance':
            return 'Bảo trì';
        default:
            return status;
    }
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
    }).format(price);
};

const getFullAddress = (item: ApartmentRoomRequest) => {
    return item.addressDetail || 'Đang cập nhật';
};

const RoomsSection = ({
                          initialRooms,
                          sharedFilters = {},
                      }: RoomsSectionProps) => {
    const [rooms, setRooms] = useState<ApartmentRoomRequest[]>(initialRooms);
    const [loading, setLoading] = useState(false);
    const [joinDialogOpen, setJoinDialogOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<ApartmentRoomRequest | null>(null);
    const [isJoining, setIsJoining] = useState(false);
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

    const { isLoggedIn, userType } = useAppSelector((state) => ({
        isLoggedIn: state.auth.isLoggedIn,
        userType: state.auth.userType
    }));

    const isConsumer = isLoggedIn && userType === 'consumer';

    const fetchFavorites = useCallback(async () => {
        if (!isConsumer) return;
        try {
            const data = await favoriteAPI.list();
            setFavorites(data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    }, [isConsumer]);

    const handleJoinClick = (room: ApartmentRoomRequest) => {
        setSelectedRoom(room);
        setJoinDialogOpen(true);
    };

    const handleConfirmJoin = async () => {
        if (!selectedRoom) return;
        
        try {
            setIsJoining(true);
            await contactAPI.join({
                LandlordUid: selectedRoom.landlordUid,
                ApartmentUid: selectedRoom.uid as string,
                Type: 'Room'
            });
            setJoinDialogOpen(false);
            setSelectedRoom(null);
            ctoast.success('Bạn Đã Gửi Lời Mời Tham Trọ Thành Công Hãy Đợi Chủ Trọ Chấp Nhận Lời Mời')
        } catch (error) {
        } finally {
            setIsJoining(false);
            ctoast.error('Bạn Đã Gửi Lời Mời Tham Gia Trọ Rồi')
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [isConsumer]);

    useEffect(() => {
        const hasFilters = Object.keys(sharedFilters).some(
            (key) =>
                sharedFilters[key as keyof SharedFilters] !== undefined &&
                sharedFilters[key as keyof SharedFilters] !== ""
        );

        if (!hasFilters) {
            setRooms(initialRooms);
            return;
        }

        const fetchFiltered = async () => {
            try {
                setLoading(true);
                const data = await publicApartmentRoomAPI.list(sharedFilters);
                setRooms(data);
            } catch (error) {
                console.error('Error filtering rooms:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFiltered();
    }, [JSON.stringify(sharedFilters), initialRooms]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="flex flex-col items-center space-y-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-muted-foreground">Đang tải dữ liệu phòng trọ...</p>
                </div>
            </div>
        );
    }

    const hasFilters = Object.keys(sharedFilters).length > 0;

    return (
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

            {rooms.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                        <div className="p-4 bg-muted rounded-full">
                            <Building className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">
                                {hasFilters ? "Không tìm thấy phòng trọ nào" : "Không có phòng trọ nào"}
                            </h3>
                            <p className="text-muted-foreground max-w-md">
                                {hasFilters
                                    ? "Không có phòng trọ nào phù hợp với bộ lọc của bạn. Hãy thử điều chỉnh lại tiêu chí tìm kiếm."
                                    : "Hiện chưa có phòng trọ nào được đăng tải. Hãy quay lại sau để xem các phòng trọ mới!"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {rooms.map((room) => (
                        <Card
                            key={room.uid}
                            className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary/20"
                        >
                            <div className="relative h-48 bg-muted overflow-hidden">
                                {room.images && room.images.length > 0 && room.images[0] ? (
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
                                <div className="absolute top-3 right-3 flex items-center gap-2">
                                    <Badge variant={getStatusVariant(room.status)} className="shadow-lg">
                                        {getStatusText(room.status)}
                                    </Badge>
                                    <FavoriteButton
                                        roomUid={room.uid!}
                                        type="RoomBased"
                                        isLoggedIn={isConsumer}
                                        favorites={favorites}
                                        onToggle={fetchFavorites}
                                    />
                                </div>
                                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Badge variant="secondary" className="backdrop-blur-sm">
                                        {room.areaLength && room.areaWidth
                                            ? `${room.areaLength * room.areaWidth}m²`
                                            : 'N/A'}
                                    </Badge>
                                </div>
                            </div>

                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg line-clamp-1">
                                    Phòng trọ
                                </CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {room.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="pb-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold text-primary">
                                        {formatPrice(room.price || 0)}
                                        <span className="text-sm font-normal text-muted-foreground">/tháng</span>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span className="flex-1 line-clamp-2">{getFullAddress(room)}</span>
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-col gap-2">
                                <Link href={`/apartment/${room.uid}/details`} className="w-full">
                                    <Button className="w-full group/btn bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary" size="sm">
                      <span className="group-hover/btn:translate-x-1 transition-transform">
                        Xem chi tiết
                      </span>
                                    </Button>
                                </Link>

                                {isConsumer ? (
                                    <Button 
                                        className="w-full group/btn" 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => handleJoinClick(room)}
                                    >
                    <span className="group-hover/btn:translate-x-1 transition-transform">
                      Tham gia trọ
                    </span>
                                    </Button>
                                ) : (
                                    <Link href="/consumer/passport/login" className="w-full">
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
            )}

            <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận tham gia trọ</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn tham gia phòng trọ này không?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setJoinDialogOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button 
                            onClick={handleConfirmJoin}
                            disabled={isJoining}
                        >
                            {isJoining ? 'Đang xử lý...' : 'Xác nhận'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RoomsSection;
