'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DialogDelete from '@/components/ui/dialog-delete'
import ctoast from '@/components/ui/Toast'
import { CDataTable } from '@/app/components/Table/CDataTable'
import { BreadcrumbNavigation } from "@/app/components/layout/BreadcrumbNavigation"

import {
    useContractData,
    createContractPath,
    contractSearchKeys,
    contractPageSizeOptions,
    ContractActions,
    contractListBreadcrumb
} from "@/app/landlord/contracts/use/use-contract-data"
import { ContractAPI } from "@/app/landlord/contracts/api"
import { ContractRequest } from "@/app/landlord/contracts/type/contract"

export default function ContractsPage() {
    const router = useRouter()
    const [contracts, setContracts] = useState<ContractRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [deleteContract, setDeleteContract] = useState<ContractRequest | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const fetchContracts = async () => {
        setLoading(true)
        try {
            const api = new ContractAPI()
            const data = await api.list()
            setContracts(data)
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tải dữ liệu hợp đồng')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchContracts()
    }, [])

    const handleDeleteContract = async () => {
        if (!deleteContract) return
        setIsDeleting(true)
        try {
            const api = new ContractAPI()
            await api.delete(deleteContract.uid as string)
            setContracts((prev) => prev.filter((c) => c.uid !== deleteContract.uid))
            setDeleteContract(null)
            ctoast.success('Xóa hợp đồng thành công!')
        } catch {
            ctoast.error('Xóa hợp đồng thất bại!')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleContractAction = async (action: string, contract: ContractRequest) => {
        switch (action) {
            case 'view':
                router.push(`/landlord/contracts/${contract.uid}`)
                break
            case 'edit':
                router.push(`/landlord/contracts/${contract.uid}/edit`)
                break
            case 'toggle-payment':
                await handleTogglePayment(contract)
                break
            case 'delete':
                setDeleteContract(contract)
                break
            default:
                break
        }
    }

    const handleTogglePayment = async (contract: ContractRequest) => {
        setIsDeleting(true)
        try {
            const api = new ContractAPI()
            const updated = {
                ...contract,
                isPayment: !contract.isPayment,
            }
            await api.update(contract.uid as string, updated)
            setContracts((prev) =>
                prev.map((c) => (c.uid === contract.uid ? updated : c))
            )
            const message = updated.isPayment
                ? 'Đánh dấu thanh toán thành công! Tháng này đã thanh toán.'
                : 'Hủy đánh dấu thanh toán thành công! Tháng này chưa thanh toán.'
            ctoast.success(message)
        } catch {
            ctoast.error('Cập nhật trạng thái thanh toán thất bại!')
        } finally {
            setIsDeleting(false)
        }
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500 text-center">
                    <p>Đã xảy ra lỗi khi tải dữ liệu hợp đồng</p>
                    <p className="text-sm text-gray-600 mt-2">{error}</p>
                </div>
            </div>
        )
    }

    const columns = useContractData.map((col) => {
        if (col.key === 'uid') {
            return {
                ...col,
                render: (row: ContractRequest) => (
                    <ContractActions
                        contract={row}
                        onAction={(action) => handleContractAction(action, row)}
                        isLoading={isDeleting && deleteContract?.uid === row.uid}
                    />
                ),
            }
        }
        return col
    })

    return (
        <>
            <BreadcrumbNavigation {...contractListBreadcrumb} />
            <CDataTable
                data={contracts}
                createPath={createContractPath}
                columns={columns}
                searchKeys={contractSearchKeys}
                pageSizeOptions={contractPageSizeOptions}
                loading={loading}
            />

            <DialogDelete
                isOpen={!!deleteContract}
                onClose={() => setDeleteContract(null)}
                onConfirm={handleDeleteContract}
                isLoading={isDeleting}
                title="Xác nhận xóa"
                deleteQuestion={`Bạn có chắc chắn muốn xóa hợp đồng này không?`}
            />
        </>
    )
}
