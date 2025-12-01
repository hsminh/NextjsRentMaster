'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store'
import { setCredentials } from '@/store/authSlice'
import { AuthSchemaType, createAuthValidation } from '@/shared/types/validator/validators'
import { AdminAuthAPI } from '@/app/admin/passport/api'
import ctoast from '@/components/ui/Toast'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

export default function AdminLogin() {
    const router = useRouter()
    const dispatch = useAppDispatch()

    const form = useForm<AuthSchemaType>({
        resolver: zodResolver(createAuthValidation()),
        defaultValues: { gmail: '', password: '' },
        mode: 'onTouched',
    })

    const onSubmit = async (data: AuthSchemaType) => {
        try {
            const api = new AdminAuthAPI()
            const response = await api.login({ gmail: data.gmail, password: data.password })

            localStorage.setItem('access_token', response.token)
            localStorage.setItem('userData', JSON.stringify(response.user))

            dispatch(
                setCredentials({
                    token: response.token,
                    userType: 'admin',
                    userData: response.user
                })
            )

            ctoast.success('Đăng nhập thành công')
            router.push('/admin/dashboard')
        } catch {
            ctoast.error('Thông tin đăng nhập không chính xác')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <Card className="w-full max-w-md shadow-xl rounded-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-gray-900">Đăng nhập Admin</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="gmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="admin@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mật khẩu</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
