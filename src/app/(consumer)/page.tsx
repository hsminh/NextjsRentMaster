import { publicApartmentAPI, publicApartmentRoomAPI } from '@/app/(consumer)/consumer/api';
import ClientHomeWrapper from "@/app/(consumer)/consumer/Component/HomePage";

async function getApartmentData() {
    const [apartmentsData, roomsData] = await Promise.all([
        publicApartmentAPI.list(),
        publicApartmentRoomAPI.list()
    ]);
    return { apartmentsData, roomsData };
}

export default async function HomePage() {
    const { apartmentsData, roomsData } = await getApartmentData();

    return (
        <ClientHomeWrapper
            initialApartments={apartmentsData}
            initialRooms={roomsData}
        />
    );
}