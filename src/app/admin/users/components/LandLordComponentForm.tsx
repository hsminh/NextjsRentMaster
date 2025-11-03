'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toastError, toastSuccess } from '@/components/ui/Toast'
import { AdminUsersAPI } from '@/app/admin/users/api'
import type { AdminUserCreateDTO } from '@/app/admin/users/types'
import { userSchema } from '@/app/admin/users/types/validator'

type UserFormValues = z.infer<typeof userSchema>

interface LandLordComponentFormProps {
    isEdit: boolean
    uid?: string
}
export default function LandLordComponentForm({isEdit,uid,}: LandLordComponentFormProps) {
    const api = new AdminUsersAPI()
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            gmail: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
        },
    })

    useEffect(() => {
        if (isEdit && uid) {
            setLoading(true)
            api
                .detail(uid)
                .then((data) => {
                    form.reset({
                        gmail: data.gmail ?? '',
                        password: '',
                        firstName: data.firstName ?? '',
                        lastName: data.lastName ?? '',
                        phoneNumber: data.phoneNumber ?? '',
                    })
                })
                .catch(() => toastError('Không thể tải dữ liệu người dùng'))
                .finally(() => setLoading(false))
        }
    }, [isEdit, uid, form])

    const handleSubmit = async (values: UserFormValues) => {
        try {
            if (isEdit) {
                if (!uid) return toastError('Thiếu ID người dùng')
                await api.update(uid, { uid, ...values })
                toastSuccess('Cập nhật thành công')
            } else {
                await api.create(values as AdminUserCreateDTO)
                toastSuccess('Tạo người dùng thành công')
            }
            router.push('/admin/users')
        } catch (err: any) {
            toastError(err?.message || (isEdit ? 'Cập nhật thất bại' : 'Tạo thất bại'))
        }
    }

    if (loading) return <div className="p-6 text-gray-600">Đang tải dữ liệu...</div>

    return (
        <div className="w-full">
                <h1 className="text-2xl font-semibold mb-6 text-gray-800">
                    {isEdit ? 'Chỉnh sửa người dùng' : 'Tạo người dùng mới'}
                </h1>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
                    >
                        {/* Gmail */}
                        <FormField
                            control={form.control}
                            name="gmail"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="font-bold text-gray-700">
                                        Gmail <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập gmail"
                                            isInvalid={!!fieldState.error}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password */}
                        {!isEdit && (
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold text-gray-700">
                                            Mật khẩu <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Nhập mật khẩu"
                                                isInvalid={!!fieldState.error}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* First name */}
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="font-bold text-gray-700">Tên</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập tên"
                                            isInvalid={!!fieldState.error}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Last name */}
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="font-bold text-gray-700">Họ</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập họ"
                                            isInvalid={!!fieldState.error}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Phone */}
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field, fieldState }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel className="font-bold  text-gray-700">
                                        Số điện thoại
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập số điện thoại"
                                            isInvalid={!!fieldState.error}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Button */}
                        <div className="md:col-span-2 flex justify-end pt-6">
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                className="px-8 h-14 bg-primary text-white font-semibold hover:bg-primary/90"
                            >
                                {form.formState.isSubmitting
                                    ? 'Đang lưu...'
                                    : isEdit
                                        ? 'Cập nhật'
                                        : 'Tạo mới'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
    )
}
