'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import {RootState, useAppDispatch} from '@/store'
import {ConsumerApi} from "@/app/(consumer)/consumer/api/consumer-api";
import {setVerified, updateUserData} from "@/store/authSlice";
import ctoast from "@/components/ui/Toast";

const profileFormSchema = z.object({
    firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
    lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
    phoneNumber: z.string().min(10, { message: 'Please enter a valid phone number.' }),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, { message: 'Password must be at least 6 characters.' }).optional(),
    confirmPassword: z.string().optional(),
})
    .refine((data) => !data.newPassword || data.currentPassword, {
        message: 'Current password is required to set a new password',
        path: ['currentPassword'],
    })
    .refine((data) => !data.newPassword || data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfilePage() {
    const [isLoading, setIsLoading] = useState(false)
    const consumerApiClient =new ConsumerApi()
    const { userData } = useSelector((state: RootState) => state.auth)
    const dispatch = useAppDispatch()
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            phoneNumber: userData?.phone || '',
        },
    })

    async function onSubmit(data: ProfileFormValues) {
        try {
            setIsLoading(true)

            const updateData: any = {
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                password: data.newPassword,
                Gmail: userData?.email,
            }
            await consumerApiClient.updateConsumer(userData?.uid as string, updateData);
            dispatch(updateUserData({
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
            }));

            if (!userData?.isVerified) {
                const verificationResult = await consumerApiClient.checkVerified(userData?.uid as string);

                const isNowVerified = verificationResult?.is_verified || false;

                if (isNowVerified) {
                    dispatch(setVerified(true));
                }
            }
            ctoast.success('Hồ sơ đã được cập nhật thành công')
        } catch (error: any) {
            ctoast.error('Cập nhật hồ sơ thất bại')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground">Update your account settings and password here.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>

                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="+84123456789" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="pt-6 border-t">
                        <h3 className="text-lg font-medium">Change Password</h3>
                        <p className="text-sm text-muted-foreground">
                            Leave these fields empty to keep your current password.
                        </p>
                    </div>

                    <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Profile
                    </Button>
                </form>
            </Form>
        </div>
    )
}
