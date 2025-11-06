'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store'
import { setCredentials } from '@/store/authSlice'
import { AdminAuthAPI } from '@/app/admin/passport/api'
import { LoginSchemaType, LoginValidationSchema } from "@/app/admin/passport/login/types/validators"
import Link from 'next/link'
import ctoast from "@/components/ui/Toast";

export default function Home() {
    const router = useRouter()
    const dispatch = useAppDispatch()

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginValidationSchema()),
        mode: 'onTouched',
    })

    const onSubmit = async (data: LoginSchemaType) => {
        try {
            const api = new AdminAuthAPI()
            const response = await api.login(data)
            dispatch(setCredentials({ token: response.token }))
            localStorage.setItem('access_token', response.token)
            ctoast.success('Đăng nhập thành công')
            router.push('/admin/dashboard')
        } catch (error: any) {
            ctoast.error('Thông Tin Đăng Nhập Không Chính Xác')
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md mx-auto mt-20">
            <div className="p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Chào mừng trở lại</h1>
                    <p className="text-gray-600">Đăng nhập để tiếp tục</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                {...register('gmail')}
                                className={`block w-full pl-3 pr-3 py-3 border ${errors.gmail ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base`}
                            />
                        </div>
                        {errors.gmail && (
                            <p className="mt-2 text-sm text-red-600">{errors.gmail.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                                className={`block w-full pl-3 pr-3 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base`}
                            />
                        </div>
                        {errors.password && (
                            <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <span className="text-gray-500 text-sm">Chưa có tài khoản? </span>
                    <Link
                        href="/admin/passport/register"
                        className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                        Tạo tài khoản mới
                    </Link>
                </div>
            </div>
        </div>
    )
}
