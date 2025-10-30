'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchemaType, LoginValidationSchema } from "@/app/admin/passport/login/types/validators"
import { useRouter } from 'next/navigation'
import {AdminAuthAPI} from "@/app/admin/passport/login/types/api";

export default function Home() {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginValidationSchema()),
        mode: 'onTouched',
    })

    const onSubmit = async (data: LoginSchemaType) => {
        try {
            const api = new AdminAuthAPI()
            const response = await api.login(data)

            localStorage.setItem('access_token', response.token)

            router.push('/admin/dashboard')
        } catch (error: any) {
            console.error('Login failed:', error)
            alert('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-white">
            <div className="w-full max-w-sm rounded-2xl border border-gray-200 p-6 shadow-md">
                <h1 className="mb-6 text-center text-2xl font-semibold text-gray-800">Đăng nhập</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            {...register('gmail')}
                            className={`mt-1 w-full rounded-lg border p-2.5 focus:border-black focus:outline-none focus:ring-1 focus:ring-black ${
                                errors.gmail ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />

                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Mật khẩu
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...register('password')}
                            className={`mt-1 w-full rounded-lg border p-2.5 focus:border-black focus:outline-none focus:ring-1 focus:ring-black ${
                                errors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-900 disabled:opacity-60"
                    >
                        {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>
            </div>
        </div>
    )
}
