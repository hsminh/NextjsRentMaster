'use client'

import {Card} from "@/components/ui/card";
import React from "react";
import {ApartmentRoomForm} from "@/app/landlord/rooms/components/ApartmentRoomForm";

export default function CreateApartmentRoomPage() {
    return (
        <div className="min-h-full">
            <Card className="w-full">
                <div className="px-6">
                    <ApartmentRoomForm />
                </div>
            </Card>
        </div>
    )
}
