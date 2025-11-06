'use client'

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
import { Loader2 } from "lucide-react"
import { useState } from "react"
import ctoast from "@/components/ui/Toast"
import { Textarea } from "@/components/ui/textarea"
import { NumberInput } from '@/components/ui/number-input'

interface ApartmentFormProps {
    initialData?: ApartmentRequest
    isEdit?: boolean
}

export function ApartmentForm({ initialData, isEdit = false }: ApartmentFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<ApartmentFormValues>({
        resolver: zodResolver(apartmentFormSchema),
        defaultValues: initialData || {
            title: '',
            description: '',
            price: 0,
            addressDivisionUid: '',
            areaLength: 0,
            areaWidth: 0,
            quantity: 1,
            floorNumber: 1,
            totalFloors: 1,
            type: ApartmentType.FULL_APARTMENT,
            status: ApartmentStatus.AVAILABLE,
            images: [],
        },
    })

    const onSubmit = async (values: ApartmentFormValues) => {
        try {
            setIsLoading(true)
            const api = new ApartmentAPI()

            if (isEdit && initialData?.uid) {
                await api.update(initialData.uid, values)
                ctoast.success('Cập nhật thông tin căn hộ thành công')
            } else {
                await api.create(values)
                ctoast.success('Tạo mới căn hộ thành công')
            }

            router.push('/landlord/apartments')
            router.refresh()
        } catch (error) {
            ctoast.success('Đã xảy ra lỗi khi lưu thông tin')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Tiêu đề */}
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

                    {/* Giá thuê */}
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

                    {/* Loại phòng */}
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loại phòng</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full h-12 px-3 py-2 text-sm border border-input rounded-md shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                                            <SelectValue placeholder="Chọn loại phòng" className="w-full" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="w-[var(--radix-select-trigger-width)] min-w-[8rem] p-1">
                                        {apartmentTypeOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                                className="relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Chiều dài */}
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

                    {/* Chiều rộng */}
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

                    {/* Tầng số */}
                    <FormField
                        control={form.control}
                        name="floorNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tầng số</FormLabel>
                                <FormControl>
                                    <NumberInput
                                        placeholder="Nhập số tầng"
                                        value={field.value}
                                        onChange={(val) => field.onChange(val)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Tổng số tầng */}
                    <FormField
                        control={form.control}
                        name="totalFloors"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tổng số tầng</FormLabel>
                                <FormControl>
                                    <NumberInput
                                        placeholder="Nhập tổng số tầng"
                                        value={field.value}
                                        onChange={(val) => field.onChange(val)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Số lượng phòng */}
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Số lượng phòng</FormLabel>
                                <FormControl>
                                    <NumberInput
                                        placeholder="Nhập số lượng phòng"
                                        value={field.value}
                                        onChange={(val) => field.onChange(val)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>

                {/* Mô tả */}
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

                {/* TODO: Add image upload component */}

                {/* Nút thao tác */}
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
