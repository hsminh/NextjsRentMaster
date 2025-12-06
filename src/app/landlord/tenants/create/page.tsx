'use client'

import { Card } from "@/components/ui/card";
import React from "react";
import { BreadcrumbNavigation } from "@/app/components/layout/BreadcrumbNavigation";
import {apartmentCreateBreadcrumb} from "@/app/landlord/apartments/use/use-apartment-data";
import {ApartmentForm} from "@/app/landlord/apartments/components/ApartmentForm";

export default function CreateApartmentPage() {
    return (
        <div className="min-h-full space-y-4">
            <BreadcrumbNavigation {...apartmentCreateBreadcrumb} />
            <Card className="w-full">
                <div className="px-6 py-6">
                    <ApartmentForm />
                </div>
            </Card>
        </div>
    )
}
