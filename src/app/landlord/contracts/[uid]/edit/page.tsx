'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ContractAPI } from '../../api'
import { ContractRequest } from '../../type/contract'
import { Loader2 } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { BreadcrumbNavigation } from "@/app/components/layout/BreadcrumbNavigation"
import { contractEditBreadcrumb } from "@/app/landlord/contracts/use/use-contract-data"
import ContractForm from "@/app/landlord/contracts/components/ContractForm"

export default function EditContractPage() {
    const params = useParams()
    const [contract, setContract] = useState<ContractRequest | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchContract = async () => {
            try {
                const api = new ContractAPI()
                const data = await api.detail(params.uid as string)
                setContract(data)
            } catch (error) {
                console.error('Failed to fetch contract:', error)
            } finally {
                setLoading(false)
            }
        }

        if (params.uid) {
            fetchContract()
        }
    }, [params.uid])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!contract) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold">Không tìm thấy hợp đồng</h2>
                <p className="text-muted-foreground mt-2">
                    Hợp đồng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                </p>
            </div>
        )
    }

    return (
        <div className="min-h-full space-y-4">
            <BreadcrumbNavigation {...contractEditBreadcrumb} />
            <Card className="w-full">
                <div className="px-6 py-6">
                    <h2 className="text-2xl font-bold mb-6">Cập nhật hợp đồng</h2>
                    <ContractForm
                        isEdit={true}
                        initialData={contract}
                    />
                </div>
            </Card>
        </div>
    )
}
