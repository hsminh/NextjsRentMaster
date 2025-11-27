'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store'
import { setCredentials } from '@/store/authSlice'
import { AuthSchemaType, createAuthValidation } from '@/shared/types/validator/validators'
import ctoast from '@/components/ui/Toast'
import Link from 'next/link'

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {ConsumerAPI} from "@/app/(consumer)/consumer/passport/api";

export default function HomeLogin() {
    const router = useRouter()
    const dispatch = useAppDispatch()

    const form = useForm<AuthSchemaType>({
        resolver: zodResolver(createAuthValidation()),
        defaultValues: {
            gmail: '',
            password: '',
        },
        mode: 'onTouched',
    })

    const onSubmit = async (data: AuthSchemaType) => {
        try {
            const api = new ConsumerAPI()
            const response = await api.login({
                gmail: data.gmail,
                password: data.password,
            })
            dispatch(setCredentials({ token: response.token, userType: 'consumer' }))
            localStorage.setItem('access_token', response.token)
            ctoast.success('Đăng nhập thành công')
            router.push('/')
        } catch {
            ctoast.error('Thông tin đăng nhập không chính xác')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <Card className="w-full max-w-md shadow-xl rounded-2xl">
                <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-3xl font-bold text-gray-900">
                        Đăng nhập
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        Đăng nhập để trải nghiệm dịch vụ của chúng tôi
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="gmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="you@example.com"
                                                {...field}
                                            />
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
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center justify-end">
                                <Link
                                    href="#"
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>

                            <Button type="submit" className="w-full" size="lg">
                                Đăng nhập
                            </Button>
                        </form>
                    </Form>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    <p className="text-sm text-gray-600">
                        Chưa có tài khoản?{' '}
                        <Link
                            href="/consumer/passport/register"
                            className="font-medium text-primary hover:underline"
                        >
                            Đăng ký ngay
                        </Link>
                    </p>
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Hoặc đăng nhập với
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <Button variant="outline" type="button">
                            <svg
                                className="mr-2 h-4 w-4"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                            </svg>
                            Google
                        </Button>
                        <Button variant="outline" type="button">
                            <svg
                                className="mr-2 h-4 w-4"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.295 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.595 1.028 2.688 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.146 20.115 22 16.379 22 12.017 22 6.484 17.522 2 12 2z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            GitHub
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
