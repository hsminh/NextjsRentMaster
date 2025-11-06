'use client'

import { Card } from "@/components/ui/card"
import LandLordComponentForm from '@/app/admin/(features)/users/components/LandLordComponentForm'

export default function UserCreatePage() {
    return (
        <div className="min-h-full">
            <Card className="w-full mt-4">
                <div className="p-6">
                    <LandLordComponentForm isEdit={true} initialData={null} />
                </div>
            </Card>
        </div>
    )
}
