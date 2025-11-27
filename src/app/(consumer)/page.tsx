// app/page.tsx (ví dụ)
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatbotWidget from '@/components/ChatbotWidget';
import { publicApartmentAPI, publicApartmentRoomAPI } from '@/app/(consumer)/consumer/api';
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import ExploreSection from "@/components/ExploreSection";

export default async function HomePage() {
    const [apartmentsData, roomsData] = await Promise.all([
        publicApartmentAPI.list(),
        publicApartmentRoomAPI.list()
    ]);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <HeroSection />
            <StatsSection
                apartmentsCount={apartmentsData.length}
                roomsCount={roomsData.length}
            />

            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
                <ExploreSection
                    initialApartments={apartmentsData}
                    initialRooms={roomsData}
                />

                <FeaturesSection />
            </section>

            <Footer />
            <ChatbotWidget />
        </div>
    );
}
