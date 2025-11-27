'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ApartmentAPI } from '../api'
import { ApartmentRequest } from '../type/apartment'
import { apartmentFormSchema, ApartmentFormValues } from '@/app/landlord/apartments/type/validations/apartment'
import { ApartmentType, ApartmentStatus, apartmentTypeOptions } from '../type/apartment-enums'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Loader2 } from 'lucide-react'
import ctoast from '@/components/ui/Toast'
import { Textarea } from '@/components/ui/textarea'
import { NumberInput } from '@/components/ui/number-input'
import CImageUploader from '@/components/ui/CImageUploader'
import { isBlobUrl, revokePreviewUrl } from '@/app/utils/image-utils'
import { createFormData } from '@/app/utils/form-utils'
import { AddressInterface } from '@/shared/types/response/address'
import { AddressDivisionAPI } from "@/shared/api"

interface ApartmentFormProps {
    initialData?: ApartmentRequest
    isEdit?: boolean
    isDetails?: boolean
}

export function ApartmentForm({ initialData, isEdit = false, isDetails = false }: ApartmentFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [previewFiles, setPreviewFiles] = useState<string[]>([])
    const [provinces, setProvinces] = useState<AddressInterface[]>([])
    const [wards, setWards] = useState<AddressInterface[]>([])

    const getFormTitle = () => {
        if (isDetails) return 'Chi tiết căn hộ'
        if (isEdit) return 'Chỉnh sửa căn hộ'
        return 'Tạo căn hộ mới'
    }

    const form = useForm<ApartmentFormValues>({
        resolver: zodResolver(apartmentFormSchema),
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            price: initialData?.price || 0,
            areaLength: initialData?.areaLength || 0,
            areaWidth: initialData?.areaWidth || 0,
            type: (initialData?.type as ApartmentType) || ApartmentType.FULL_APARTMENT,
            status: (initialData?.status as ApartmentStatus) || ApartmentStatus.AVAILABLE,
            Files: initialData?.images || [],
            provinceDivisionUid: initialData?.provinceDivisionUid || undefined,
            wardDivisionUid: initialData?.wardDivisionUid || undefined,
            MetaData: initialData?.metaData || '',
        },
    })

    const isDisabled = isDetails || isLoading
    const currentType = form.watch('type')
    const formTitle = getFormTitle()

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const api = new AddressDivisionAPI()
                const data = await api.listProvinces()
                setProvinces(data)
            } catch (e) {
                console.error(e)
                ctoast.error('Không tải được danh sách tỉnh/thành')
            }
        }

        fetchProvinces()
    }, [])

    useEffect(() => {
        const provinceUid = initialData?.provinceDivisionUid
        if (!provinceUid) return

        const fetchWards = async () => {
            try {
                const api = new AddressDivisionAPI()
                const data = await api.listWards(provinceUid)
                setWards(data)
            } catch (e) {
                console.error(e)
            }
        }

        fetchWards()
    }, [initialData?.provinceDivisionUid])

    useEffect(() => {
        if ((isEdit || isDetails) && initialData?.images?.length) {
            setPreviewFiles(initialData.images)
            form.setValue('Files', initialData.images)
        }
    }, [isEdit, isDetails, initialData, form])

    useEffect(() => {
        return () => {
            if (previewFiles) {
                previewFiles.forEach((url) => {
                    if (isBlobUrl(url)) revokePreviewUrl(url)
                })
            }
        }
    }, [previewFiles])

    const handleProvinceChange = async (uid: string) => {
        form.setValue('provinceDivisionUid', uid)
        form.setValue('wardDivisionUid', undefined)
        setWards([])

        if (!uid) return

        try {
            const api = new AddressDivisionAPI()
            const data = await api.listWards(uid) // parentCode = province uid
            setWards(data)
        } catch (e) {
            console.error(e)
            ctoast.error('Không tải được danh sách phường/xã')
        }
    }

    const onSubmit = async (values: ApartmentFormValues) => {
        if (isDetails) return

        try {
            setIsLoading(true)
            const api = new ApartmentAPI()
            const formData = await createFormData(values, values.Files)

            if (isEdit && initialData?.uid) {
                await api.update(initialData.uid, formData)
                ctoast.success('Cập nhật thông tin căn hộ thành công')
            } else {
                await api.create(formData)
                ctoast.success('Tạo mới căn hộ thành công')
                router.push('/landlord/apartments')
                router.refresh()
            }
        } catch (error) {
            console.error(error)
            ctoast.error('Đã xảy ra lỗi khi lưu thông tin')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Title của form */}
            <div className="border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-900">{formTitle}</h1>
                <p className="text-gray-600 mt-1">
                    {isDetails
                        ? 'Xem thông tin chi tiết về căn hộ'
                        : isEdit
                            ? 'Chỉnh sửa thông tin căn hộ hiện có'
                            : 'Thêm thông tin căn hộ mới vào hệ thống'
                    }
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Thông tin cơ bản */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tiêu đề</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập tiêu đề căn hộ" {...field} disabled={isDisabled} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Giá thuê (VNĐ)</FormLabel>
                                    <FormControl>
                                        <NumberInput
                                            placeholder="Nhập giá thuê"
                                            value={field.value}
                                            onChange={(val) => field.onChange(val)}
                                            disabled={isDisabled}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="areaLength"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Chiều dài (m²)</FormLabel>
                                    <FormControl>
                                        <NumberInput
                                            placeholder="Nhập chiều dài"
                                            value={field.value}
                                            onChange={(val) => field.onChange(val)}
                                            disabled={isDisabled}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="areaWidth"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Chiều rộng (m²)</FormLabel>
                                    <FormControl>
                                        <NumberInput
                                            placeholder="Nhập chiều rộng"
                                            value={field.value}
                                            onChange={(val) => field.onChange(val)}
                                            disabled={isDisabled}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Địa chỉ: Province + Ward */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="provinceDivisionUid"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tỉnh / Thành phố</FormLabel>
                                    <Select
                                        disabled={isDisabled}
                                        value={field.value}
                                        onValueChange={(val) => handleProvinceChange(val)}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full h-12">
                                                <SelectValue placeholder="Chọn tỉnh / thành" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {provinces.map((p) => (
                                                <SelectItem key={p.uid} value={p.uid}>
                                                    {p.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="wardDivisionUid"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phường / Xã</FormLabel>
                                    <Select
                                        disabled={isDisabled || wards.length === 0}
                                        value={field.value}
                                        onValueChange={(val) => form.setValue('wardDivisionUid', val)}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full h-12">
                                                <SelectValue placeholder="Chọn phường / xã" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {wards.map((w) => (
                                                <SelectItem key={w.uid} value={w.uid}>
                                                    {w.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="MetaData"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Số nhà/Địa chỉ</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ví dụ: 123 Đường ABC"
                                        {...field}
                                        disabled={isDisabled}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mô tả</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Nhập mô tả chi tiết về căn hộ"
                                        className="min-h-[120px]"
                                        {...field}
                                        disabled={isDisabled}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loại phòng</FormLabel>
                                <Select disabled={isDisabled} onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full h-12">
                                            <SelectValue placeholder="Chọn loại phòng" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {apartmentTypeOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {currentType === ApartmentType.FULL_APARTMENT ? (
                        <FormField
                            control={form.control}
                            name="Files"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hình ảnh căn hộ</FormLabel>
                                    <FormControl>
                                        <CImageUploader
                                            key={initialData?.uid || 'new'}
                                            multiple
                                            required
                                            defaultFiles={initialData?.images || []}
                                            onChange={(files, newPreviews, allPreviews) => {
                                                setPreviewFiles(allPreviews)
                                                form.setValue('Files', allPreviews)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ) : (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg p-4">
                            Sau khi cập nhật từng phòng, bạn có thể thêm ảnh cho từng phòng riêng biệt.
                        </div>
                    )}

                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push('/landlord/apartments')}
                            disabled={isLoading}
                        >
                            {isDetails ? 'Đóng' : 'Hủy'}
                        </Button>
                        {!isDetails && (
                            <Button type="submit" disabled={isDisabled}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang lưu...
                                    </>
                                ) : isEdit ? (
                                    'Cập nhật'
                                ) : (
                                    'Tạo mới'
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    )
}