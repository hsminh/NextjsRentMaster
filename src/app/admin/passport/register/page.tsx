'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterSchemaType, RegisterValidationSchema } from '@/app/admin/passport/register/types/validators'
import { useRouter } from 'next/navigation'
import { AdminAuthAPI } from '@/app/admin/passport/api'
import Link from 'next/link'
import { toastError, toastSuccess } from '@/components/ui/Toast'
import { handleFormErrors } from '@/app/utils/helper/FormErrors'
import { FormErrorMessage } from '@/app/components/form/FormErrorMessage'

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { Mail, Lock, Loader2 } from 'lucide-react'

export default function RegisterPage() {
    const router = useRouter()
    const form = useForm<RegisterSchemaType>({
        resolver: zodResolver(RegisterValidationSchema()),
        mode: 'onTouched',
    })

    const {
        handleSubmit,
        formState: { isSubmitting },
        setError,
    } = form

    const onSubmit = async (data: RegisterSchemaType) => {
        try {
            const api = new AdminAuthAPI()
            await api.register({ gmail: data.gmail, password: data.password })
            toastSuccess('Đăng ký thành công')
            router.push('/admin/passport/login')
        } catch (error: any) {
            const handled = handleFormErrors<RegisterSchemaType>(setError, error)
            if (!handled) toastError('Đăng ký thất bại. Vui lòng thử lại.')
        }
    }

    return (
        <div className="flex items-center justify-center  bg-gray-50">
            <Card className="w-full max-w-md shadow-xl rounded-2xl">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl font-bold">Tạo tài khoản mới</CardTitle>
                    <CardDescription className="text-gray-500">
                        Điền thông tin để đăng ký
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="gmail"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                                <Input
                                                    placeholder="you@example.com"
                                                    type="email"
                                                    className="pl-10"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormErrorMessage error={fieldState.error} />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel>Mật khẩu</FormLabel>
                                            <span className="text-xs text-gray-500">
                        Tối thiểu 6 ký tự
                      </span>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                                <Input
                                                    placeholder="••••••••"
                                                    type="password"
                                                    className="pl-10"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormErrorMessage error={fieldState.error} />
                                    </FormItem>
                                )}
                            />

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Đang đăng ký...
                                    </>
                                ) : (
                                    'Đăng ký'
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 mb-3">Đã có tài khoản?</p>
                        <Link href="/admin/passport/login" className="w-full block">
                            <Button variant="outline" className="w-full">
                                Đăng nhập ngay
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
