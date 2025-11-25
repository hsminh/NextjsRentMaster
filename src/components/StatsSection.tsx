"use client";
import { ApartmentRequest } from "@/app/landlord/apartments/type/apartment";
import { ApartmentRoomRequest } from "@/app/landlord/rooms/type/apartment";

export default function StatsSection({
                                         apartmentsCount,
                                         roomsCount,
                                     }: {
    apartmentsCount: number;
    roomsCount: number;
}) {
    return (
        <section className="bg-muted/30 py-16 border-y">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

                    <div className="relative rounded-2xl overflow-hidden p-8 shadow-lg">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/features.jpg')" }} />
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                        <div className="relative flex flex-col items-center">
                            <div className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{apartmentsCount}+</div>
                            <p className="text-white font-medium drop-shadow-lg">Căn hộ nguyên căn</p>
                        </div>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden p-8 shadow-lg">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/features2.jpg')" }} />
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                        <div className="relative flex flex-col items-center">
                            <div className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{roomsCount}+</div>
                            <p className="text-white font-medium drop-shadow-lg">Phòng trọ</p>
                        </div>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden p-8 shadow-lg">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/features1.jpg')" }} />
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                        <div className="relative flex flex-col items-center">
                            <div className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">99%</div>
                            <p className="text-white font-medium drop-shadow-lg">Khách hàng hài lòng</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
