'use client'

import { Card } from "@/components/ui/card"
import React from "react"
import { BreadcrumbNavigation } from "@/app/components/layout/BreadcrumbNavigation"
import { contractCreateBreadcrumb } from "@/app/landlord/contracts/use/use-contract-data"
import ContractForm from "@/app/landlord/contracts/components/ContractForm"

export default function CreateContractPage() {
    return (
        <div className="min-h-full space-y-4">
            <BreadcrumbNavigation {...contractCreateBreadcrumb} />
            <Card className="w-full">
                <div className="px-6 py-6">
                    <h2 className="text-2xl font-bold mb-6">Tạo hợp đồng mới</h2>
                    <ContractForm />
                </div>
            </Card>
        </div>
    )
}
