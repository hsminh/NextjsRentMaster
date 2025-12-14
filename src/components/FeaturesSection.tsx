"use client";

import Link from "next/link";
import { useState, useEffect } from 'react';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {MapPin, Home, Building, Star, Shield, DollarSign, Badge} from 'lucide-react';
import { Info, Mail, User, Plus } from "lucide-react"
export default function HeroSection() {
    return (
        <section className="bg-gradient-to-br from-muted/50 to-background py-20 border-y">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-16">
                    <Badge  className="px-4 py-2 text-base">
                        ✨ Tại sao chọn chúng tôi?
                    </Badge>
                    <h2 className="text-4xl font-bold tracking-tight">Trải nghiệm khác biệt</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Những lý do khiến HomeStay trở thành lựa chọn hàng đầu
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card
                        className="text-center border-0 shadow-lg bg-background/50 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="pt-8 pb-8">
                            <div
                                className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                                <Shield className="w-8 h-8"/>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">An toàn & Bảo mật</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Tất cả thông tin đều được xác thực và bảo mật tuyệt đối
                            </p>
                        </CardContent>
                    </Card>
                    <Card
                        className="text-center border-0 shadow-lg bg-background/50 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="pt-8 pb-8">
                            <div
                                className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                                <DollarSign className="w-8 h-8"/>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Giá cả minh bạch</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Không có chi phí ẩn, giá cả công khai rõ ràng từ đầu
                            </p>
                        </CardContent>
                    </Card>
                    <Card
                        className="text-center border-0 shadow-lg bg-background/50 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="pt-8 pb-8">
                            <div
                                className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                                <Star className="w-8 h-8"/>
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
    )
};