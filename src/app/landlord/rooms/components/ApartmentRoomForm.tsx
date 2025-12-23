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
import CImageUploader from '@/components/ui/CImageUploader'
import { isBlobUrl, revokePreviewUrl } from '@/app/utils/image-utils'
import { createFormData } from '@/app/utils/form-utils'

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'

import { ApartmentAPI } from '@/app/landlord/apartments/api'
import { RoomAPI } from '@/app/landlord/rooms/api'
import { ApartmentRoomRequest } from '@/app/landlord/rooms/type/apartment'
import { apartmentRoomFormSchema, ApartmentRoomFormValues } from '@/app/landlord/rooms/type/validations/apartment'

const metaOptions = [
    { key: 'floor', label: 'Phòng ở tầng' },
    { key: 'bedrooms', label: 'Số phòng ngủ' },
    { key: 'bathrooms', label: 'Số phòng tắm' },
    { key: 'fullFurniture', label: 'Đầy đủ nội thất' },
]

type MetaRow = { id: string; key: string; value: string }

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

    const [metaRows, setMetaRows] = useState<MetaRow[]>([])

    const form = useForm<ApartmentRoomFormValues>({
        resolver: zodResolver(apartmentRoomFormSchema),
        defaultValues: {
            apartmentUid: initialData?.apartmentUid || '',
            description: initialData?.description || '',
            price: initialData?.price ?? 0,
            areaLength: initialData?.areaLength ?? 0,
            areaWidth: initialData?.areaWidth ?? 0,
            Files: (initialData?.images as any) || [],
            metaData: initialData?.metaData,
        },
    })

    const isDisabled = isDetails || isLoading

    const syncMetaToForm = (rows: MetaRow[]) => {
        const meta: Record<string, string> = {}
        rows.forEach((r) => {
            if (r.key && r.value) {
                meta[r.key] = r.value
            }
        })
        if (Object.keys(meta).length === 0) {
            form.setValue('metaData', undefined as any)
        } else {
            form.setValue('metaData', meta as any)
        }
    }

    const prepareFormData = (values: ApartmentRoomFormValues) => {
        const { metaData, ...rest } = values;
        return {
            ...rest,
            MetaDataJson: metaData 
        };
    };

    useEffect(() => {
        const fetchApartments = async () => {
            try {
                const api = new ApartmentAPI()
                const list = await api.list('RoomBased')
                setApartments(list.map((a: any) => ({ uid: a.uid, title: a.title })))
            } catch (error) {
                console.error('Lỗi khi lấy danh sách căn hộ:', error)
            }
        }
        fetchApartments()
    }, [])

    useEffect(() => {
        if ((isEdit || isDetails) && initialData?.images?.length) {
            setPreviewFiles(initialData.images)
            form.setValue('Files', initialData.images as any)
        }
    }, [isEdit, isDetails, initialData, form])

    useEffect(() => {
        if (initialData?.metaData) {
            const rows: MetaRow[] = Object.entries(initialData.metaData)
                .filter(([_, v]) => v !== undefined)
                .map(([k, v]) => ({
                    id: k,      
                    key: k,
                    value: String(v),
                }))
            setMetaRows(rows)
            syncMetaToForm(rows)
        }
    }, [initialData])

    useEffect(() => {
        return () => {
            previewFiles.forEach((url) => {
                if (isBlobUrl(url)) revokePreviewUrl(url)
            })
        }
    }, [previewFiles])

    const handleAddMetaRow = () => {
        const usedKeys = metaRows.map((r) => r.key)
        const available = metaOptions.find((o) => !usedKeys.includes(o.key))

        if (!available) return

        const newRows = [
            ...metaRows,
            { id: available.key, key: available.key, value: '' },
        ]
        setMetaRows(newRows)
        syncMetaToForm(newRows)
    }

    const handleRemoveMetaRow = (id: string) => {
        const newRows = metaRows.filter((r) => r.id !== id)
        setMetaRows(newRows)
        syncMetaToForm(newRows)
    }

    const handleChangeMetaKey = (id: string, newKey: string) => {
        const newRows = metaRows.map((r) =>
            r.id === id ? { ...r, key: newKey } : r
        )
        setMetaRows(newRows)
        syncMetaToForm(newRows)
    }

    const handleChangeMetaValue = (id: string, newValue: string) => {
        const newRows = metaRows.map((r) =>
            r.id === id ? { ...r, value: newValue } : r
        )
        setMetaRows(newRows)
        syncMetaToForm(newRows)
    }

    const onSubmit = async (values: ApartmentRoomFormValues) => {
        if (isDetails) return

        try {
            setIsLoading(true)
            const api = new RoomAPI()
            const backendData = prepareFormData(values)
            const formData = await createFormData(backendData, values.Files)

            if (isEdit && (initialData as any)?.uid) {
                await api.update((initialData as any).uid, formData)
                ctoast.success('Cập nhật phòng thành công')
            } else {
                await api.create(formData)
                ctoast.success('Tạo mới phòng thành công')
                // router.push('/landlord/rooms')
            }
        } catch (error) {
            console.error(error)
            ctoast.error('Có lỗi xảy ra khi lưu thông tin phòng')
        } finally {
            setIsLoading(false)
        }
    }

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
                                    <Select
                                        value={field.value || ''}
                                        onValueChange={field.onChange}
                                        disabled={isDisabled}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="-- Chọn căn hộ --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {apartments.map((ap) => (
                                                <SelectItem key={ap.uid} value={ap.uid}>
                                                    {ap.title}
                                                </SelectItem>
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
                                    <NumberInput
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="VD: 5,000,000"
                                        disabled={isDisabled}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Area Length */}
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

                    {/* Area Width */}
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

                    {/* MetaData dynamic (full width) */}
                    <div className="sm:col-span-2 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Các Thông Tin Cơ Bản</span>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={handleAddMetaRow}
                                disabled={isDisabled || metaRows.length >= metaOptions.length}
                            >
                                + Thêm thuộc tính
                            </Button>
                        </div>

                        {metaRows.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                Chưa có thuộc tính nào. Nhấn <b>“+ Thêm thuộc tính”</b> để bắt đầu.
                            </p>
                        )}

                        {metaRows.map((row) => {
                            const usedKeys = metaRows
                                .filter((r) => r.id !== row.id)
                                .map((r) => r.key)

                            const availableOptions = metaOptions.filter(
                                (o) => o.key === row.key || !usedKeys.includes(o.key)
                            )

                            const selectedOption = metaOptions.find((o) => o.key === row.key)

                            return (
                                <div
                                    key={row.id}
                                    className="grid grid-cols-[1.5fr,2fr,auto] gap-2 items-center"
                                >
                                    {/* Select key */}
                                    <Select
                                        value={row.key}
                                        onValueChange={(v) => handleChangeMetaKey(row.id, v)}
                                        disabled={isDisabled}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn loại thông tin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableOptions.map((opt) => (
                                                <SelectItem key={opt.key} value={opt.key}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Input value */}
                                    <Input
                                        value={row.value}
                                        onChange={(e) =>
                                            handleChangeMetaValue(row.id, e.target.value)
                                        }
                                        placeholder={selectedOption?.label ?? 'Nhập giá trị'}
                                        disabled={isDisabled}
                                    />

                                    {/* Remove */}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleRemoveMetaRow(row.id)}
                                        disabled={isDisabled}
                                    >
                                        -
                                    </Button>
                                </div>
                            )
                        })}

                        <FormMessage>
                            {form.formState.errors.metaData?.message as any}
                        </FormMessage>
                    </div>

                    {/* Description */}
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

                    {/* Files */}
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
                                            form.setValue('Files', allPreviews as any)
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
