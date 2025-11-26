'use client'

import { Card } from "@/components/ui/card"
import LandLordComponentForm from '@/app/admin/(features)/users/components/LandLordComponentForm'
import {BreadcrumbNavigation} from "@/app/components/layout/BreadcrumbNavigation";
import {getApartmentDetailBreadcrumb} from "@/app/landlord/apartments/use/use-apartment-data";
import {ApartmentForm} from "@/app/landlord/apartments/components/ApartmentForm";
export default function UserCreatePage() {
    return (

        <div className="min-h-full space-y-4">
            <BreadcrumbNavigation {...getApartmentDetailBreadcrumb} />
        <div className="min-h-full">
            <Card className="w-full mt-4">
                <div className="p-6">
                    <LandLordComponentForm isEdit={true} initialData={null} />
                </div>
            </Card>
        </div>
        </div>
    )
}
