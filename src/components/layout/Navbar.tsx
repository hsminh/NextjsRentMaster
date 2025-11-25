'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {MapPin, Home, Building, Star, Shield, DollarSign, Badge} from 'lucide-react';
import { Info, Mail, User, Plus } from "lucide-react"


import { publicApartmentAPI, publicApartmentRoomAPI } from '@/app/(consumer)/api';
import { ApartmentRequest } from "@/app/landlord/apartments/type/apartment";
import { ApartmentRoomRequest } from "@/app/landlord/rooms/type/apartment";
export default function Navbar() {
    return (
        <header className="absolute top-4 left-0 right-0 z-50">
            <div className="max-w-10xl mx-auto px-4">
                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between py-5 px-6">

                        {/* Logo */}
                        <div className="flex items-center space-x-3 flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                                <Home className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-white text-2xl font-bold">HomeStay</h1>
                        </div>

                        {/* Menu */}
                        <nav className="flex-1 flex justify-center space-x-10">

                            <Link href="/" className="flex items-center space-x-2 text-white text-lg font-medium hover:text-primary transition-colors relative group">
                                <Home className="w-5 h-5 text-white" />
                                <span>Trang chủ</span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </Link>

                            <Link href="/about" className="flex items-center space-x-2 text-white/80 text-lg hover:text-primary transition-colors relative group">
                                <Info className="w-5 h-5" />
                                <span>Giới thiệu</span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </Link>

                            <Link href="/contact" className="flex items-center space-x-2 text-white/80 text-lg hover:text-primary transition-colors relative group">
                                <Mail className="w-5 h-5" />
                                <span>Liên hệ</span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </Link>

                            <Link href="/login" className="flex items-center space-x-2 text-white/80 text-lg hover:text-primary transition-colors relative group">
                                <User className="w-5 h-5" />
                                <span>Đăng nhập</span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </Link>

                            <Link href="/post" className="flex items-center space-x-2 text-white/80 text-lg hover:text-primary transition-colors relative group">
                                <Plus className="w-5 h-5" />
                                <span>Đăng tin</span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </Link>

                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}
