'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import LandLordComponentForm from '@/app/admin/(features)/users/components/LandLordComponentForm'

export default function CreateUserPageInUsers() {
  return (
    <div className="min-h-full">
      <Card className="w-full">
        <div className="px-6">
          <LandLordComponentForm isEdit={false} />
        </div>
      </Card>
    </div>
  )
}
