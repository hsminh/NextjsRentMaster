'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import HeroSection from "@/components/HeroSection"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import ChatbotWidget from '@/components/ChatbotWidget'
import StatsSection from "@/components/StatsSection"
import FeaturesSection from "@/components/FeaturesSection"
import ExploreSection from "@/components/ExploreSection"
import { Loader2 } from 'lucide-react'
import {ApartmentRequest} from "@/app/landlord/apartments/type/apartment";
import {ApartmentRoomRequest} from "@/app/landlord/rooms/type/apartment";

function HomePageLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="mt-4 text-sm text-muted-foreground">
                    Đang tải...
                </p>
            </div>
        </div>
    );
}
interface ClientHomeWrapperProps {
    initialApartments: ApartmentRequest[];
    initialRooms: ApartmentRoomRequest[];
}


export default function ClientHomeWrapper({ initialApartments, initialRooms }: ClientHomeWrapperProps) {
    const router = useRouter()
    const { isLoggedIn, isVerified, userData, userType } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
    }, [isLoggedIn, isVerified, userData, userType, router])

    if (isLoggedIn && userData && userType === 'consumer' && !isVerified) {
        router.push(`/profile`)
        return
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <HeroSection />
            <StatsSection
                apartmentsCount={initialApartments.length}
                roomsCount={initialRooms.length}
            />

            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
                <ExploreSection
                    initialApartments={initialApartments}
                    initialRooms={initialRooms}
                />

                <FeaturesSection />
            </section>

            <Footer />
            <ChatbotWidget />
        </div>
    )
}