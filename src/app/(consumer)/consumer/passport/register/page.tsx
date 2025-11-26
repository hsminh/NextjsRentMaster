'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ConsumerAPI } from '../api'
import ctoast from '@/components/ui/Toast'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'

import { AuthSchemaType, createAuthValidation } from '@/shared/types/validator/validators'
import { handleFormErrors } from "@/app/utils/helper/FormErrors";

export default function ConsumerRegister() {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<AuthSchemaType>({
        resolver: zodResolver(createAuthValidation()),
        defaultValues: {
            gmail: '',
            password: ''
        },
        mode: 'onChange',
    })

    const onSubmit = async (formData: AuthSchemaType) => {
        try {
            const api = new ConsumerAPI()
            await api.register({
                gmail: formData.gmail,
                password: formData.password
            })
            ctoast.success('Đăng ký thành công! Vui lòng đăng nhập')
            reset()
            router.push('/consumer/passport/login')
        } catch (error: any) {
            const handled = handleFormErrors<AuthSchemaType>(setError, error)
            if (!handled) {
                ctoast.error('Đăng ký thất bại. Vui lòng thử lại.')
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
            <Card className="w-full max-w-md border-0 shadow-2xl rounded-3xl bg-white/95 backdrop-blur-sm">
                <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-3xl font-bold text-gray-900">
                        Đăng ký tài khoản
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        Tạo tài khoản để tìm kiếm nhà trọ phù hợp
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
{/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Nhập email của bạn"
                                {...register('gmail')}
                                className={`${
                                    errors.gmail
                                        ? 'border-red-500 focus-visible:ring-red-500'
                                        : 'focus-visible:ring-blue-500'
                                }`}
                            />
                            {errors.gmail && (
                                <p className="text-sm text-red-600">{errors.gmail.message}</p>
                            )}
                        </div>

                        {/* Mật khẩu */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Tối thiểu 6 ký tự"
                                {...register('password')}
                                className={`${
                                    errors.password
                                        ? 'border-red-500 focus-visible:ring-red-500'
                                        : 'focus-visible:ring-blue-500'
                                }`}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>


                        <Button 
                            type="submit" 
                            className="w-full mt-4"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-600">
                        Đã có tài khoản?{' '}
                        <Link 
                            href="/consumer/passport/login" 
                            className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                        >
                            Đăng nhập ngay
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
