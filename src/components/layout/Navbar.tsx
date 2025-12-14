'use client';

import Link from "next/link";
import { useState } from 'react';
import { Home, Info, Mail, User, Plus, ChevronDown, LogOut, Settings, Heart } from "lucide-react"
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";


import { LucideIcon } from 'lucide-react';

const DropdownItem = ({ href, icon: Icon, label, onClick }: { href: string, icon: LucideIcon, label: string, onClick?: () => void }) => (
    <Link href={href} className="flex items-center px-4 py-2 text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors" onClick={onClick}>
        <Icon className="w-4 h-4 mr-2" />
        {label}
    </Link>
);

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Lấy trạng thái từ Redux
    const { userData, userType, isLoggedIn } = useSelector((state: RootState) => state.auth);
    const favorites = useSelector((state: RootState) => state.favorite.items);
    const favoritesCount = favorites.length;

    const isAuthenticated = isLoggedIn && userType === 'consumer';

    const avatarUrl = userData?.avatarUrl  || null;
    const fallbackText = userData?.firstName ? userData.firstName[0].toUpperCase() : 'U';

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const handleLogout = () => {
        console.log("Thực hiện Đăng xuất (Redux)");
        setIsDropdownOpen(false);
    };

    const renderDropdownItems = () => {
        const items = [];

        if (userType === 'consumer') {
            items.push(
                <DropdownItem key="profile" href="/profile" icon={User} label="Hồ sơ cá nhân" />,
                <DropdownItem key="bookings" href="/consumer/bookings" icon={Settings} label="Quản lý đặt chỗ" />,
                <div key="divider-post" className="border-t border-gray-200 my-1"></div>,
                <DropdownItem key="post" href="/landlord/passport/login" icon={Plus} label="Đăng tin cho thuê" />
            );
        }

        return items;
    };


    return (
        <header className="absolute top-4 left-0 right-0 z-50">
            <div className="max-w-10xl mx-auto px-4">
                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between py-5 px-6">

                        <div className="flex items-center space-x-3 flex-shrink-0">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary via-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-2xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300">
                                <div className="absolute inset-0 rounded-2xl bg-white/10 animate-pulse" />
                                <Home className="w-7 h-7 text-white relative z-10" />
                            </div>
                            <h1 className="text-white text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text">HomeStay</h1>
                        </div>

                        <nav className="flex-1 flex justify-center space-x-10">
                            <Link href="/" className="flex items-center space-x-2 text-white text-lg font-medium hover:text-primary transition-colors relative group">
                                <Home className="w-5 h-5 text-white" />
                                <span>Trang chủ</span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </Link>

                            <Link href="/consumer/about" className="flex items-center space-x-2 text-white/80 text-lg hover:text-primary transition-colors relative group">
                                <Info className="w-5 h-5" />
                                <span>Giới thiệu</span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </Link>

                            <Link href="/consumer/contact" className="flex items-center space-x-2 text-white/80 text-lg hover:text-primary transition-colors relative group">
                                <Mail className="w-5 h-5" />
                                <span>Liên hệ</span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </Link>
                        </nav>

                        <div className="relative flex items-center space-x-4 flex-shrink-0">

                            {isAuthenticated ? (
                                <>
                                    <Link href="/favorites" className="flex items-center relative p-2 rounded-full transition-colors duration-200 hover:bg-white/10">
                                        <Heart className="w-5 h-5 text-white" />
                                        {favoritesCount > 0 && (
                                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                {favoritesCount}
                                            </span>
                                        )}
                                    </Link>
                                    <div className="relative">
                                        <button
                                            onClick={toggleDropdown}
                                            className="flex items-center p-1 rounded-full transition-colors duration-200 hover:bg-white/10 focus:outline-none"
                                        >
                                            <Avatar className="w-14 h-14 border-2 border-white/50">
                                                <AvatarImage src={avatarUrl || undefined} alt={userData?.firstName || "User"} />
                                                <AvatarFallback className="bg-primary text-white text-lg font-medium">
                                                    {fallbackText}
                                                </AvatarFallback>
                                            </Avatar>

                                            <ChevronDown
                                                className={`w-4 h-4 ml-2 text-white transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                                            />
                                        </button>

                                        {isDropdownOpen && (
                                            <div className="absolute top-full right-0 mt-3 w-48 bg-white/90 backdrop-blur-md rounded-lg shadow-xl overflow-hidden border border-gray-200 z-50">
                                                <div className="py-1">
                                                    {renderDropdownItems()}

                                                    <div className="border-t border-gray-200 my-1"></div>
                                                    <button
                                                        className="w-full flex items-center px-4 py-2 text-red-500 hover:bg-red-500/10 transition-colors"
                                                        onClick={handleLogout}
                                                    >
                                                        <LogOut className="w-4 h-4 mr-2" />
                                                        Đăng xuất
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link href="/landlord/passport/login" className="flex items-center space-x-2 text-white/80 text-lg hover:text-primary transition-colors relative group">
                                        <Plus className="w-5 h-5" />
                                        <span>Đăng tin</span>
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                                    </Link>

                                    <Link href="/consumer/passport/login" className="flex items-center space-x-2 text-white/80 text-lg hover:text-primary transition-colors relative group">
                                        <User className="w-5 h-5" />
                                        <span>Đăng nhập</span>
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                                    </Link>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </header>
    );
}