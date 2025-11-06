'use client'

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
import ctoast from "@/components/ui/Toast"
import { AdminUsersAPI } from '@/app/admin/(features)/users/api'
import type { AdminUser, AdminUserCreateDTO } from '@/app/admin/(features)/users/types'
import { userSchema } from '@/app/admin/(features)/users/types/validator'

type UserFormValues = z.infer<typeof userSchema>

interface LandLordComponentFormProps {
    isEdit: boolean
    isDetails?: boolean
    initialData?: AdminUser | null
}

export default function LandLordComponentForm({ isEdit, isDetails = false, initialData }: LandLordComponentFormProps) {
    const api = new AdminUsersAPI()
    const router = useRouter()

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            gmail: initialData?.gmail ?? '',
            password: initialData?.password ?? '',
            firstName: initialData?.firstName ?? '',
            lastName: initialData?.lastName ?? '',
            phoneNumber: initialData?.phoneNumber ?? '',
        },
    })

    const handleSubmit = async (values: UserFormValues) => {
        if (isDetails) return

        try {
            if (isEdit && initialData) {
                await api.update(initialData.uid, { ...values, uid: initialData.uid })
                ctoast.success('Cập nhật thành công')
            } else {
                await api.create(values as AdminUserCreateDTO)
                ctoast.success('Tạo người dùng thành công')
            }
            router.push('/admin/users')
        } catch (err: any) {
            ctoast.error(err?.message || (isEdit ? 'Cập nhật thất bại' : 'Tạo thất bại'))
        }
    }

    const isDisabled = isDetails || form.formState.isSubmitting

    return (
        <div className="w-full">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">
                {isDetails ? 'Chi tiết người dùng' : isEdit ? 'Chỉnh sửa người dùng' : 'Tạo người dùng mới'}
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
                                <FormLabel>Gmail <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input
                                        readOnly={isEdit || isDisabled}
                                        className={(isEdit || isDisabled) ? "bg-gray-100 cursor-not-allowed" : ""}
                                        placeholder="Nhập gmail"
                                        {...field}
                                        isInvalid={!!fieldState.error}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Password */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel>Mật khẩu <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Nhập mật khẩu"
                                        disabled={isDisabled}
                                        {...field}
                                        isInvalid={!!fieldState.error}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* First name */}
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel>Tên</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nhập tên"
                                        disabled={isDisabled}
                                        {...field}
                                        isInvalid={!!fieldState.error}
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
                                <FormLabel>Họ</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nhập họ"
                                        disabled={isDisabled}
                                        {...field}
                                        isInvalid={!!fieldState.error}
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
                                <FormLabel>Số điện thoại</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nhập số điện thoại"
                                        disabled={isDisabled}
                                        {...field}
                                        isInvalid={!!fieldState.error}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="md:col-span-2 flex justify-end gap-4 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            className="px-8"
                            onClick={() => router.back()}
                        >
                            Quay lại
                        </Button>

                        {!isDetails && (
                            <Button
                                type="submit"
                                loading={form.formState.isSubmitting}
                            >
                                {isEdit ? 'Cập nhật' : 'Tạo mới'}
                            </Button>
                        )}
                    </div>

                </form>
            </Form>
        </div>
    )
}
