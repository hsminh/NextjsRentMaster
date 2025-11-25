'use client'

import {Card} from "@/components/ui/card";
import React from "react";
import {ApartmentRoomForm} from "@/app/landlord/rooms/components/ApartmentRoomForm";
import {roomCreateBreadcrumb} from "@/app/landlord/rooms/use/use-room-data";

import {BreadcrumbNavigation} from "@/app/components/layout/BreadcrumbNavigation";
export default function CreateApartmentRoomPage() {
    return (
        <div className="min-h-full space-y-4">
            <BreadcrumbNavigation {...roomCreateBreadcrumb} />
        <div className="min-h-full">
            <Card className="w-full">
                <div className="px-6">
                    <ApartmentRoomForm />
                </div>
            </Card>
        </div>
        </div>
    )
}
