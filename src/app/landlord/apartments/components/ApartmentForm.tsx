import { useState, useEffect, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ApartmentAPI } from '../api'
import { ApartmentRequest } from '../type/apartment'
import { apartmentFormSchema, ApartmentFormValues } from '../validations/apartment'
import { ApartmentType, ApartmentStatus, apartmentTypeOptions } from '../type/apartment-enums'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Loader2 } from 'lucide-react'
import ctoast from '@/components/ui/Toast'
import { Textarea } from '@/components/ui/textarea'
import { NumberInput } from '@/components/ui/number-input'
import CImageUploader from "@/components/ui/CImageUploader"
import { handleFileUploads, isBlobUrl, revokePreviewUrl } from '@/app/utils/image-utils'

interface ApartmentFormProps {
    initialData?: ApartmentRequest
    isEdit?: boolean
}

export function ApartmentForm({ initialData, isEdit = false }: ApartmentFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [previewFiles, setPreviewFiles] = useState<string[]>([])

    const form = useForm<ApartmentFormValues>({
        resolver: zodResolver(apartmentFormSchema),
        defaultValues: initialData ? {
            ...initialData,
            Files: initialData.images || []
        } : {
            title: '',
            description: '',
            price: 0,
            areaLength: 0,
            areaWidth: 0,
            type: ApartmentType.FULL_APARTMENT,
            status: ApartmentStatus.AVAILABLE,
            Files: [],
        },
    });

    useEffect(() => {
        if (isEdit && initialData?.images?.length) {
            setPreviewFiles(initialData.images);
            form.setValue('Files', initialData.images);
        }
    }, [isEdit, initialData, form]);
    useEffect(() => {
        return () => {
            if (previewFiles) {
                previewFiles.forEach(url => {
                    if (isBlobUrl(url)) {
                        revokePreviewUrl(url);
                    }
                });
            }
        };
    }, [previewFiles]);

    const onSubmit = async (values: ApartmentFormValues) => {
        try {
            setIsLoading(true)
            const api = new ApartmentAPI()
            const formData = new FormData()

            Object.entries(values).forEach(([key, value]) => {
                if (key === 'Files' || value === undefined || value === null) return
                formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value))
            })

            if (values.Files && Array.isArray(values.Files)) {
                const newFiles = values.Files.filter(file =>
                    typeof file === 'string' && isBlobUrl(file)
                ) as string[];
                if (newFiles.length > 0) {
                    await handleFileUploads(newFiles, formData);
                }
            }

            if (isEdit && initialData?.uid) {
                await api.update(initialData.uid, formData)
                ctoast.success('Cập nhật thông tin căn hộ thành công')
            } else {
                await api.create(formData)
                ctoast.success('Tạo mới căn hộ thành công')
            }

            router.push('/landlord/apartments')
            router.refresh()
        } catch (error) {
            ctoast.error('Đã xảy ra lỗi khi lưu thông tin')
        } finally {
            setIsLoading(false)
        }
    }

    const currentType = form.watch('type')
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tiêu đề</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập tiêu đề căn hộ" {...field} />
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
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                        defaultFiles={form.getValues('Files')}
                                        onChange={(files, previews) => {
                                            form.setValue('Files', previews);
                                            setPreviewFiles(previews);
                                        }}
                                        required
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
                        Hủy
                    </Button>
                    <Button type="submit" disabled={isLoading}>
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
                </div>
            </form>
        </Form>
    )
}
