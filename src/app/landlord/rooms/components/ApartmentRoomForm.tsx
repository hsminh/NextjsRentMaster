'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { NumberInput } from '@/components/ui/number-input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import ctoast from '@/components/ui/Toast'
import CImageUploader from "@/components/ui/CImageUploader"
import { isBlobUrl, revokePreviewUrl } from '@/app/utils/image-utils'
import { createFormData } from "@/app/utils/form-utils"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { ApartmentAPI } from '@/app/landlord/apartments/api'
import { RoomAPI } from "@/app/landlord/rooms/api"
import { ApartmentRoomRequest } from "@/app/landlord/rooms/type/apartment"
import { apartmentRoomFormSchema, ApartmentRoomFormValues } from "@/app/landlord/rooms/type/validations/apartment"

interface ApartmentRoomFormProps {
    initialData?: ApartmentRoomRequest
    isEdit?: boolean
    isDetails?: boolean
}

export function ApartmentRoomForm({ initialData, isEdit = false, isDetails = false }: ApartmentRoomFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [previewFiles, setPreviewFiles] = useState<string[]>([])
    const [apartments, setApartments] = useState<{ uid: string; title: string }[]>([])

    const form = useForm<ApartmentRoomFormValues>({
        resolver: zodResolver(apartmentRoomFormSchema),
        defaultValues: {
            apartmentUid: initialData?.apartmentUid || '',
            description: initialData?.description || '',
            price: initialData?.price ?? 0,
            areaLength: initialData?.areaLength ?? 0,
            areaWidth: initialData?.areaWidth ?? 0,
            Files: initialData?.Files || [],
        },
    })

    // Fetch apartments
    useEffect(() => {
        const fetchApartments = async () => {
            try {
                const api = new ApartmentAPI()
                const list = await api.list()
                setApartments(list.map(a => ({ uid: a.uid, title: a.title } as any)))
            } catch (error) {
                console.error('Lỗi khi lấy danh sách căn hộ:', error)
            }
        }
        fetchApartments()
    }, [])

    useEffect(() => {
        if ((isEdit || isDetails) && initialData?.images?.length) {
            setPreviewFiles(initialData.images)
            form.setValue('Files', initialData.images)
        }
    }, [isEdit, isDetails, initialData, form])

    useEffect(() => {
        return () => {
            previewFiles.forEach(url => {
                if (isBlobUrl(url)) revokePreviewUrl(url)
            })
        }
    }, [previewFiles])

    const onSubmit = async (values: ApartmentRoomFormValues) => {
        if (isDetails) return

        try {
            setIsLoading(true)
            const api = new RoomAPI()
            const formData = await createFormData(values, values.Files)

            if (isEdit && initialData?.uid) {
                await api.update(initialData.uid, formData)
                ctoast.success('Cập nhật phòng thành công')
            } else {
                await api.create(formData)
                ctoast.success('Tạo phòng thành công')
                router.push('/landlord/rooms')
            }
        } catch (error) {
            console.error(error)
            ctoast.error('Lỗi khi lưu thông tin phòng')
        } finally {
            setIsLoading(false)
        }
    }

    const isDisabled = isDetails || isLoading

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Apartment */}
                        <FormField
                            control={form.control}
                            name="apartmentUid"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Căn hộ</FormLabel>
                                    <FormControl>
                                        <Select value={field.value || ''} onValueChange={field.onChange} disabled={isDisabled}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="-- Chọn căn hộ --" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {apartments.map(ap => (
                                                    <SelectItem key={ap.uid} value={ap.uid}>{ap.title}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Price */}
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Giá thuê (VNĐ)</FormLabel>
                                    <FormControl>
                                        <NumberInput value={field.value} onChange={field.onChange} placeholder="VD: 5,000,000" disabled={isDisabled} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                    {/* Area Length full width */}
                    <FormField
                        control={form.control}
                        name="areaLength"
                        render={({ field }) => (
                            <FormItem className="sm:col-span-1 w-full">
                                <FormLabel>Chiều dài (m)</FormLabel>
                                <FormControl>
                                    <NumberInput
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="VD: 5"
                                        disabled={isDisabled}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Area Width full width */}
                    <FormField
                        control={form.control}
                        name="areaWidth"
                        render={({ field }) => (
                            <FormItem className="sm:col-span-1 w-full">
                                <FormLabel>Chiều rộng (m)</FormLabel>
                                <FormControl>
                                    <NumberInput
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="VD: 5"
                                        disabled={isDisabled}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Description full width */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="sm:col-span-2 w-full">
                                <FormLabel>Mô tả phòng</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Mô tả chi tiết..."
                                        className="min-h-[120px] resize-none"
                                        disabled={isDisabled}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Files full width */}
                    <FormField
                        control={form.control}
                        name="Files"
                        render={() => (
                            <FormItem className="sm:col-span-2 w-full">
                                <FormLabel>Hình ảnh phòng</FormLabel>
                                <FormControl>
                                    <CImageUploader
                                        key={initialData?.uid || 'new-room'}
                                        multiple
                                        required={!isEdit}
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
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/landlord/rooms')}
                        disabled={isLoading}
                        size="lg"
                    >
                        {isDetails ? 'Đóng' : 'Hủy'}
                    </Button>
                    {!isDetails && (
                        <Button type="submit" disabled={isDisabled} size="lg">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : isEdit ? (
                                'Cập nhật'
                            ) : (
                                'Tạo phòng'
                            )}
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    )
}
