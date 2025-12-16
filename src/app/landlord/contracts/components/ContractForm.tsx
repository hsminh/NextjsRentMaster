'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ContractRequest, contractTypeOptions } from '../type/contract'
import { contractFormSchema, ContractFormValues } from '../type/validations/contract'
import { ContractAPI } from '../api'
import { TenantAPI } from '@/app/landlord/tenants/api'
import { ApartmentAPI } from '@/app/landlord/apartments/api'
import { RoomAPI } from '@/app/landlord/rooms/api'
import { TenantRequest } from '@/app/landlord/tenants/type/tenant'
import { ApartmentRequest } from '@/app/landlord/apartments/type/apartment'
import { ApartmentRoomRequest } from '@/app/landlord/rooms/type/apartment'
import ctoast from '@/components/ui/Toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { Loader2, X, ChevronDown } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

interface ContractFormProps {
    isEdit?: boolean
    initialData?: ContractRequest
}

export default function ContractForm({ isEdit = false, initialData }: ContractFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [tenants, setTenants] = useState<TenantRequest[]>([])
    const [apartments, setApartments] = useState<ApartmentRequest[]>([])
    const [rooms, setRooms] = useState<ApartmentRoomRequest[]>([])
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
    const [participantSearch, setParticipantSearch] = useState<string>('')
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ContractFormValues>({
        resolver: zodResolver(contractFormSchema),
        defaultValues: initialData || {
            consumerUid: '',
            apartmentUid: '',
            type: 'RoomBased',
            responsibleUid: '',
            participantUids: [],
            monthlyPrice: 0,
            depositAmount: 0,
            startDate: '',
            endDate: '',
        },
    })

    const contractType = watch('type')

    useEffect(() => {
        fetchTenants()
        if (initialData?.participantUids && Array.isArray(initialData.participantUids)) {
            setSelectedParticipants(initialData.participantUids)
        }
    }, [])

    useEffect(() => {
        fetchUnitsByType(contractType)
    }, [contractType])

    useEffect(() => {
        setValue('participantUids', selectedParticipants)
    }, [selectedParticipants, setValue])

    const fetchTenants = async () => {
        setFetching(true)
        try {
            const api = new TenantAPI()
            const data = await api.listFiltered('Approved')
            setTenants(data)
        } catch (error) {
            ctoast.error('Lỗi khi tải danh sách người thuê')
        } finally {
            setFetching(false)
        }
    }

    const fetchUnitsByType = async (type: string) => {
        setFetching(true)
        try {
            if (type === 'RoomBased') {
                const api = new RoomAPI()
                const data = await api.list()
                setRooms(data)
                setApartments([])
            } else {
                const api = new ApartmentAPI()
                const data = await api.list()
                setApartments(data)
                setRooms([])
            }
        } catch (error) {
            ctoast.error('Lỗi khi tải danh sách phòng/căn hộ')
        } finally {
            setFetching(false)
        }
    }

    const toggleParticipant = (uid: string) => {
        setSelectedParticipants(prev =>
            prev.includes(uid)
                ? prev.filter(id => id !== uid)
                : [...prev, uid]
        )
    }

    const onSubmit = async (data: ContractFormValues) => {
        setLoading(true)

        try {
            console.log('Form validation passed, submitting data:', {
                ...data,
                participantUids: selectedParticipants,
            })

            const submitData: ContractRequest = {
                ...data,
                participantUids: selectedParticipants,
            } as ContractRequest

            console.log('Final submit data:', submitData)

            const api = new ContractAPI()

            if (isEdit && initialData?.uid) {
                await api.update(initialData.uid, submitData)
                ctoast.success('Cập nhật hợp đồng thành công!')
            } else {
                await api.create(submitData)
                ctoast.success('Tạo hợp đồng thành công!')
            }

            router.push('/landlord/contracts')
        } catch (error: any) {
            console.error('Error submitting form:', error)
            ctoast.error(error?.message || 'Lỗi khi lưu hợp đồng')
        } finally {
            setLoading(false)
        }
    }

    const getConsumerLabel = (tenant: TenantRequest) => {
        return `${tenant.consumer?.firstName || ''} ${tenant.consumer?.lastName || ''}`.trim() || tenant.consumer?.gmail || 'N/A'
    }

    const getApartmentLabel = (apt: ApartmentRequest) => apt.title || 'N/A'
    const getRoomLabel = (room: ApartmentRoomRequest) => `Phòng - ${room.price?.toLocaleString()} VNĐ` || 'N/A'
    const watchedValues = watch()
    useEffect(() => {
        console.log('Form data thay đổi:', watchedValues)
    }, [watchedValues])
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2">{contractType === 'RoomBased' ? 'Phòng trọ' : 'Căn hộ'} *</label>
                    <Select defaultValue={initialData?.apartmentUid || ''} onValueChange={(value) => setValue('apartmentUid', value)}>
                        <SelectTrigger disabled={fetching} className={errors.apartmentUid ? 'border-red-500' : ''}>
                            <SelectValue placeholder={fetching ? 'Đang tải...' : 'Chọn đơn vị'} />
                        </SelectTrigger>
                        <SelectContent>
                            {contractType === 'RoomBased' ? (
                                rooms.map((room) => (
                                    <SelectItem key={room.uid} value={room.uid || ''}>
                                        {getRoomLabel(room)}
                                    </SelectItem>
                                ))
                            ) : (
                                apartments.map((apt) => (
                                    <SelectItem key={apt.uid} value={apt.uid || ''}>
                                        {getApartmentLabel(apt)}
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                    {errors.apartmentUid && (
                        <p className="text-red-500 text-sm mt-1">{errors.apartmentUid.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Loại hợp đồng *</label>
                    <Select defaultValue={contractType} onValueChange={(value) => setValue('type', value as 'RoomBased' | 'FullApartment')}>
                        <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Chọn loại hợp đồng" />
                        </SelectTrigger>
                        <SelectContent>
                            {contractTypeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.type && (
                        <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Người chịu trách nhiệm *</label>
                    <Select defaultValue={initialData?.responsibleUid || ''} onValueChange={(value) => setValue('responsibleUid', value)}>
                        <SelectTrigger disabled={fetching} className={errors.responsibleUid ? 'border-red-500' : ''}>
                            <SelectValue placeholder={fetching ? 'Đang tải...' : 'Chọn người chịu trách nhiệm'} />
                        </SelectTrigger>
                        <SelectContent>
                            {tenants.map((tenant) => (
                                <SelectItem key={tenant.uid} value={tenant.consumer?.uid || ''}>
                                    {getConsumerLabel(tenant)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.responsibleUid && (
                        <p className="text-red-500 text-sm mt-1">{errors.responsibleUid.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Giá thuê/tháng (VNĐ) *</label>
                    <Input
                        type="number"
                        {...register('monthlyPrice', { valueAsNumber: true })}
                        placeholder="Nhập giá thuê hàng tháng"
                        className={errors.monthlyPrice ? 'border-red-500' : ''}
                    />
                    {errors.monthlyPrice && (
                        <p className="text-red-500 text-sm mt-1">{errors.monthlyPrice.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Tiền cọc (VNĐ) *</label>
                    <Input
                        type="number"
                        {...register('depositAmount', { valueAsNumber: true })}
                        placeholder="Nhập tiền cọc"
                        className={errors.depositAmount ? 'border-red-500' : ''}
                    />
                    {errors.depositAmount && (
                        <p className="text-red-500 text-sm mt-1">{errors.depositAmount.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Ngày bắt đầu *</label>
                    <DateTimePicker
                        value={initialData?.startDate || ''}
                        onChange={(date) => setValue('startDate', date)}
                        placeholder="Chọn ngày bắt đầu"
                        disabled={loading}
                    />
                    {errors.startDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {/* Cột 1: Ngày kết thúc */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Ngày kết thúc *</label>
                        <DateTimePicker
                            value={initialData?.endDate || ''}
                            onChange={(date) => setValue('endDate', date)}
                            placeholder="Chọn ngày kết thúc"
                            disabled={loading}
                        />
                        {errors.endDate && (
                            <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
                        )}
                    </div>

                    {/* Cột 2: Danh sách người tham gia */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Danh sách người tham gia</label>
                        <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full justify-between h-auto min-h-10"
                                    disabled={fetching}
                                >
                                    <div className="flex flex-wrap gap-1 items-center text-left">
                                        {selectedParticipants.length > 0 ? (
                                            selectedParticipants.slice(0, 2).map((uid) => {
                                                const tenant = tenants.find(t => t.consumer?.uid === uid)
                                                return tenant ? (
                                                    <span key={uid} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    {getConsumerLabel(tenant)}
                  </span>
                                                ) : null
                                            }).concat(
                                                selectedParticipants.length > 2 ? [
                                                    <span key="more" className="text-xs text-gray-600">
                    +{selectedParticipants.length - 2} nữa
                  </span>
                                                ] : []
                                            )
                                        ) : (
                                            <span className="text-gray-500">Chọn người tham gia...</span>
                                        )}
                                    </div>
                                    <ChevronDown className="ml-2 h-4 w-4 opacity-50 flex-shrink-0" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0" align="start">
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 px-3 py-2 border-b">
                                        <Input
                                            type="text"
                                            placeholder="Tìm kiếm..."
                                            value={participantSearch}
                                            onChange={(e) => setParticipantSearch(e.target.value)}
                                            className="border-0 bg-white text-sm"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="space-y-0 max-h-64 overflow-y-auto">
                                        {(() => {
                                            const filtered = tenants.filter(t =>
                                                getConsumerLabel(t).toLowerCase().includes(participantSearch.toLowerCase())
                                            )
                                            return filtered.length === 0 ? (
                                                <p className="text-gray-500 text-sm p-4">Không có người thuê nào</p>
                                            ) : (
                                                filtered.map((tenant) => {
                                                    const consumerUid = tenant.consumer?.uid || ''
                                                    const isSelected = selectedParticipants.includes(consumerUid)
                                                    return (
                                                        <label
                                                            key={tenant.uid}
                                                            className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors border-b ${
                                                                isSelected ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => toggleParticipant(consumerUid)}
                                                                className="rounded w-4 h-4 cursor-pointer"
                                                            />
                                                            <span className={`text-sm flex-1 ${isSelected ? 'font-medium text-blue-900' : 'text-gray-700'}`}>
                        {getConsumerLabel(tenant)}
                      </span>
                                                            {isSelected && <div className="text-blue-600 font-bold">✓</div>}
                                                        </label>
                                                    )
                                                })
                                            )
                                        })()}
                                    </div>
                                    {selectedParticipants.length > 0 && (
                                        <div className="bg-gray-50 px-4 py-3 border-t flex items-center justify-between text-xs">
              <span className="text-gray-600">
                <strong>{selectedParticipants.length}</strong> người được chọn
              </span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedParticipants([])}
                                            >
                                                Xóa tất cả
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>

                        {selectedParticipants.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {selectedParticipants.map((uid) => {
                                    const tenant = tenants.find(t => t.consumer?.uid === uid)
                                    return tenant ? (
                                        <div key={uid} className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-xs flex items-center gap-2 font-medium">
                                            {getConsumerLabel(tenant)}
                                            <button
                                                type="button"
                                                onClick={() => toggleParticipant(uid)}
                                                className="hover:text-blue-600 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : null
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-t pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        {...register('isPayment')}
                        className="w-4 h-4 rounded cursor-pointer"
                    />
                    <div>
                        <p className="text-sm font-medium">Tháng này đã thanh toán</p>
                        <p className="text-xs text-gray-500">Đánh dấu nếu người thuê đã thanh toán tiền thuê tháng này</p>
                    </div>
                </label>
            </div>

            <div className="flex gap-4 justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading || fetching}
                >
                    Hủy
                </Button>
                <Button
                    type="submit"
                    disabled={loading || fetching}
                >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEdit ? 'Cập nhật' : 'Tạo mới'}
                </Button>
            </div>
        </form>
    )
}
