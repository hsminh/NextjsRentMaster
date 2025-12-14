"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';
import { publicApartmentAPI, publicApartmentRoomAPI, contactAPI } from '@/app/(consumer)/consumer/api';
import { ApartmentRequest, ApartmentRoomRequest } from '@/app/landlord/apartments/type/apartment';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, MapPin, DollarSign, Square, Building2, Calendar, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ApartmentDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { uid } = params as { uid: string };
    
    const [data, setData] = useState<ApartmentRequest | ApartmentRoomRequest | null>(null);
    const [type, setType] = useState<'FullApartment' | 'RoomBased' | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [joining, setJoining] = useState(false);
    const [joinSuccess, setJoinSuccess] = useState(false);

    const { isLoggedIn, userType } = useAppSelector((state) => ({
        isLoggedIn: state.auth.isLoggedIn,
        userType: state.auth.userType
    }));

    const isConsumer = isLoggedIn && userType === 'consumer';

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                let result;
                let detectedType: 'FullApartment' | 'RoomBased' | null = null;
                
                const apartments = await publicApartmentAPI.list();
                result = apartments.find(apt => apt.uid === uid);
                
                if (result) {
                    detectedType = 'FullApartment';
                } else {
                    const rooms = await publicApartmentRoomAPI.list({});
                    result = rooms.find(room => room.uid === uid);
                    if (result) {
                        detectedType = 'RoomBased';
                    }
                }
                
                if (!result || !detectedType) {
                    setError('Không tìm thấy dữ liệu');
                } else {
                    setData(result);
                    setType(detectedType);
                }
            } catch (err) {
                console.error('Error fetching apartment data:', err);
                setError('Lỗi khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [uid]);

    const handleJoin = async () => {
        if (!isConsumer || !data || !type) return;

        try {
            setJoining(true);
            const landlordUid = 'landlordUid' in data ? data.landlordUid : '';
            if (!landlordUid) {
                setError('Không tìm thấy thông tin chủ nhà');
                return;
            }

            await contactAPI.join({
                LandlordUid: landlordUid,
                ApartmentUid: uid,
                Type: type
            });
            setJoinSuccess(true);
            setTimeout(() => {
                router.push('/favorites');
            }, 2000);
        } catch (err) {
            console.error('Error joining:', err);
            setError('Lỗi khi gửi yêu cầu tham gia');
        } finally {
            setJoining(false);
        }
    };

    if (!isConsumer) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6 text-center space-y-4">
                        <p className="text-lg">Vui lòng đăng nhập để xem chi tiết</p>
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
                    <p className="text-muted-foreground">Đang tải chi tiết...</p>
                </div>
            </div>
        );
    }

    if (error || !data || !type) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6 text-center space-y-4">
                        <p className="text-lg text-red-500">{error || 'Không tìm thấy dữ liệu'}</p>
                        <Link href="/favorites">
                            <Button variant="outline" className="w-full">Quay lại</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const isFullApartment = type === 'FullApartment';
    const title = isFullApartment ? 'title' in data ? (data as ApartmentRequest).title : 'Căn hộ' : 'Phòng trọ';
    const price = 'price' in data ? data.price : 0;
    const description = 'description' in data ? data.description : '';
    const images = 'images' in data ? (data as ApartmentRequest | ApartmentRoomRequest).images : [];
    const areaLength = 'areaLength' in data ? data.areaLength : 0;
    const areaWidth = 'areaWidth' in data ? data.areaWidth : 0;
    const status = 'status' in data ? data.status : 'available';
    const createdAt = 'createdAt' in data ? data.createdAt : '';

    const getStatusLabel = (status: string) => {
        switch(status) {
            case 'available':
            case 'Available': 
                return 'Còn trống';
            case 'rented': 
                return 'Đã cho thuê';
            case 'maintenance': 
                return 'Đang bảo trì';
            default: 
                return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'available':
            case 'Available':
                return 'bg-green-500/10 text-green-700';
            case 'rented':
                return 'bg-red-500/10 text-red-700';
            case 'maintenance':
                return 'bg-yellow-500/10 text-yellow-700';
            default:
                return 'bg-gray-500/10 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gradient-to-b from-background to-muted/20">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/" className="flex items-center space-x-2 text-primary hover:underline transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Về trang chủ</span>
                    </Link>
                    <span className="text-muted-foreground">|</span>
                    <Link href="/favorites" className="flex items-center space-x-2 text-primary hover:underline transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Danh sách yêu thích</span>
                    </Link>
                </div>

                <div className="space-y-6">
                    <Card className="overflow-hidden border-0 shadow-xl">
                        <div className="relative h-96 bg-gradient-to-br from-primary/10 to-primary/5">
                            {images && images.length > 0 ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={images[0]} alt={title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Home className="w-32 h-32 text-primary/30" />
                                </div>
                            )}
                            <div className="absolute top-4 left-4">
                                <Badge className={`${getStatusColor(status)} border-0 text-lg px-4 py-2`}>
                                    {getStatusLabel(status)}
                                </Badge>
                            </div>
                        </div>

                        <CardHeader className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-4xl font-bold mb-2">{title}</CardTitle>
                                    <div className="flex items-center space-x-2 text-primary">
                                        <Badge variant="outline">
                                            {isFullApartment ? '🏠 Căn hộ' : '🛏️ Phòng trọ'}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-bold text-primary mb-1">
                                        {price.toLocaleString('vi-VN')} đ
                                    </div>
                                    <p className="text-sm text-muted-foreground">Giá hàng tháng</p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold">Chi tiết</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                                        <Square className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Diện tích</p>
                                            <p className="text-lg font-semibold">{areaLength} x {areaWidth} m²</p>
                                        </div>
                                    </div>

                                    {isFullApartment && 'totalFloors' in data && (
                                        <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                                            <Building2 className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Số tầng</p>
                                                <p className="text-lg font-semibold">
                                                    {(data as ApartmentRequest).totalFloors || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                                        <DollarSign className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Giá</p>
                                            <p className="text-lg font-semibold">{price.toLocaleString('vi-VN')} đ</p>
                                        </div>
                                    </div>

                                    {createdAt && (
                                        <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                                            <Calendar className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Ngày đăng</p>
                                                <p className="text-lg font-semibold">
                                                    {new Date(createdAt).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {description && (
                                <div className="space-y-3">
                                    <h3 className="text-xl font-semibold">Mô tả</h3>
                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {description}
                                    </p>
                                </div>
                            )}

                            {isFullApartment && 'province' in data && (
                                <div className="space-y-3">
                                    <h3 className="text-xl font-semibold">Địa chỉ</h3>
                                    <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                                        <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-muted-foreground">
                                                {(data as ApartmentRequest).addressDetail}, {(data as ApartmentRequest).ward?.name}, {(data as ApartmentRequest).province?.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {images && images.length > 1 && (
                                <div className="space-y-3">
                                    <h3 className="text-xl font-semibold">Hình ảnh khác</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {images.slice(1).map((img, idx) => (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img 
                                                key={idx} 
                                                src={img} 
                                                alt={`${title} ${idx + 2}`} 
                                                className="w-full h-40 object-cover rounded-lg"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="flex gap-4">
                            <Link href="/favorites" className="flex-1">
                                <Button variant="outline" className="w-full">
                                    Quay lại
                                </Button>
                            </Link>
                            {(status === 'available' || status === 'Available') && (
                                <Button 
                                    onClick={handleJoin}
                                    disabled={joining || joinSuccess}
                                    className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white"
                                    size="lg"
                                >
                                    {joinSuccess ? (
                                        <>
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            Đã gửi yêu cầu
                                        </>
                                    ) : joining ? (
                                        <>
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                                            Đang gửi...
                                        </>
                                    ) : (
                                        '🎯 Tham gia ngay'
                                    )}
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
