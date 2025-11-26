'use client';
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState, useEffect } from 'react';
import ChatbotWidget from '@/components/ChatbotWidget';
import { publicApartmentAPI, publicApartmentRoomAPI } from '@/app/(consumer)/consumer/api';
import { ApartmentRequest } from "@/app/landlord/apartments/type/apartment";
import { ApartmentRoomRequest } from "@/app/landlord/rooms/type/apartment";
import StatsSection from "@/components/StatsSection";
import ApartmentsSection from "@/components/ApartmentsSection";
import RoomsSection from "@/components/RoomsSection";
import FeaturesSection from "@/components/FeaturesSection";


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


    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div
                        className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"/>
                    <p className="text-muted-foreground">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar/>
            <HeroSection/>
            <StatsSection apartmentsCount={apartments.length} roomsCount={rooms.length}/>
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
                <ApartmentsSection apartments={apartments} loading={loading}/>
                <RoomsSection rooms={rooms} onReload={fetchData}/>
                <FeaturesSection />
            </section>
            <Footer />
            <ChatbotWidget />
        </div>
    )
};