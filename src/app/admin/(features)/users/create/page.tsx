'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import LandLordComponentForm from '@/app/admin/(features)/users/components/LandLordComponentForm'
import {BreadcrumbNavigation} from "@/app/components/layout/BreadcrumbNavigation";
import {getApartmentDetailBreadcrumb} from "@/app/landlord/apartments/use/use-apartment-data";
import {ApartmentForm} from "@/app/landlord/apartments/components/ApartmentForm";
export default function CreateUserPageInUsers() {
  return (
    <div className="min-h-full">

        <div className="min-h-full space-y-4">
            <BreadcrumbNavigation {...getApartmentDetailBreadcrumb} />
      <Card className="w-full">
        <div className="px-6">
          <LandLordComponentForm isEdit={false} />
        </div>
      </Card>
    </div>
    </div>
  )
}
