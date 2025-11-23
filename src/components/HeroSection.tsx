"use client";

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

export default function HeroSection() {
    return (
        <section
            className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground overflow-hidden"
            style={{ backgroundImage: "url('/hero-bg.png')" }}
        >
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 relative">
                <div className="text-center space-y-8 max-w-4xl mx-auto">
                    <div className="space-y-4">
                        <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold">
                            🎯 Nền tảng tìm nhà số 1 Việt Nam
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-hb75 drop-shadow-lg">
                            Tìm Ngôi Nhà
                            <span className="block bg-gradient-to-br from-white to-white/80 bg-clip-text text-transparent font-hb75 drop-shadow-lg">
                Hoàn Hảo
              </span>
                        </h1>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 pt-8">
                        <Button size="lg" variant="secondary" className="text-base px-8 py-3 h-auto rounded-2xl shadow-lg">
                            <Building className="w-5 h-5 mr-2" />
                            Bắt đầu tìm kiếm
                        </Button>
                        <Button size="lg" variant="secondary" className="text-base px-8 py-3 h-auto rounded-2xl shadow-lg">
                            Xem tất cả
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
