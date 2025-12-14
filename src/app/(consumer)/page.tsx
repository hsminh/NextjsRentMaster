import { publicApartmentAPI, publicApartmentRoomAPI } from '@/app/(consumer)/consumer/api';
import ClientHomeWrapper from "@/app/(consumer)/consumer/Component/HomePage";

async function getApartmentData() {
    const [apartmentsData, roomsData] = await Promise.all([
        publicApartmentAPI.list(),
        publicApartmentRoomAPI.list()
    ]);

    const apartmentMap = new Map(apartmentsData.map(apt => [apt.uid, apt]));

    const enrichedRooms = roomsData.map(room => {
        const apartment = apartmentMap.get(room.apartmentUid);
        return {
            ...room,
            province: apartment?.province || null,
            ward: apartment?.ward || null,
            street: apartment?.street || null
        };
    });
    return { apartmentsData, roomsData: enrichedRooms };
}
export default async function HomePage() {
    const { apartmentsData, roomsData } = await getApartmentData();
    console.log(roomsData)
    return (
        <ClientHomeWrapper
            initialApartments={apartmentsData}
            initialRooms={roomsData}
        />
    );
}