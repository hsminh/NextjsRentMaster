"use client";

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { favoriteAPI, FavoriteItem } from '@/app/(consumer)/consumer/api';
import ctoast from "@/components/ui/Toast";

interface FavoriteButtonProps {
    apartmentUid?: string;
    roomUid?: string;
    type: 'FullApartment' | 'RoomBased';
    isLoggedIn: boolean;
    favorites: FavoriteItem[];
    onToggle?: () => void;
}

export const FavoriteButton = ({ apartmentUid, roomUid, type, isLoggedIn, favorites, onToggle }: FavoriteButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const uid = type === 'RoomBased' ? roomUid : apartmentUid;

    const isFavorited = favorites.some(item => {
        if (type === 'RoomBased' && roomUid) {
            return item.type === 'RoomBased' && item.apartmentRoomUid === roomUid;
        }
        return item.type === 'FullApartment' && item.apartmentUid === apartmentUid;
    });

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (!isLoggedIn) {
            ctoast.error('Vui lòng đăng nhập để thêm yêu thích');
            return;
        }

        if (!uid) return;

        try {
            setIsLoading(true);

            if (isFavorited) {
                const favorite = type === 'RoomBased'
                    ? favorites.find(item => item.type === 'RoomBased' && item.apartmentRoomUid === roomUid)
                    : favorites.find(item => item.type === 'FullApartment' && item.apartmentUid === apartmentUid);
                    
                if (favorite) {
                    await favoriteAPI.removeFavorite(favorite.uid);
                    ctoast.success('Đã xóa khỏi yêu thích');
                    await onToggle?.();
                }
            } else {
                const payload = type === 'RoomBased' 
                    ? { Type: type, ApartmentRoomUid: roomUid }
                    : { Type: type, ApartmentUid: apartmentUid };
                
                await favoriteAPI.create(payload);
                ctoast.success('Đã thêm vào yêu thích');
                await onToggle?.();
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            ctoast.error('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggleFavorite}
            disabled={isLoading}
            className={`p-2.5 rounded-full transition-all transform hover:scale-110 ${
                isFavorited
                    ? 'bg-red-100 text-red-500 hover:bg-red-200 shadow-md'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isFavorited ? 'Xóa yêu thích' : 'Thêm yêu thích'}
        >
            <Heart
                className={`w-7 h-7 ${isFavorited ? 'fill-current' : ''}`}
            />
        </button>
    );
};
