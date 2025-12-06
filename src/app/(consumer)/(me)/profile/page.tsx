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
import { useState, useEffect } from 'react'
import { Loader2, Home } from 'lucide-react'
import { useSelector } from 'react-redux'
import {RootState, useAppDispatch} from '@/store'
import {ConsumerApi} from "@/app/(consumer)/consumer/api/consumer-api";
import {setVerified, updateUserData} from "@/store/authSlice";
import ctoast from "@/components/ui/Toast";
import Link from "next/link";
import CImageUploader from '@/components/ui/CImageUploader'
import { isBlobUrl, revokePreviewUrl } from '@/app/utils/image-utils'
import { createFormData } from '@/app/utils/form-utils'

const profileFormSchema = z.object({
    firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
    lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
    phoneNumber: z.string().min(10, { message: 'Please enter a valid phone number.' }),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, { message: 'Password must be at least 6 characters.' }).optional(),
    confirmPassword: z.string().optional(),
    avatar: z.any().optional(),
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
    const [avatarPreview, setAvatarPreview] = useState<string[]>([])
    const consumerApiClient = new ConsumerApi()
    const { userData, isVerified, userType } = useSelector((state: RootState) => state.auth)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (userData?.avatarUrl) {
            setAvatarPreview([userData.avatarUrl])
        }
    }, [userData?.avatarUrl])
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            phoneNumber: userData?.phone || '',
            avatar: userData?.avatarUrl ? [userData.avatarUrl] : [],
        },
    })

    useEffect(() => {
        return () => {
            avatarPreview.forEach(url => {
                if (isBlobUrl(url)) revokePreviewUrl(url)
            })
        }
    }, [avatarPreview])

    async function onSubmit(data: ProfileFormValues) {
        try {
            setIsLoading(true)
            
            const submitData = {
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                email: userData?.email,
                Gmail: userData?.email,
            }

            const formData = await createFormData(submitData, avatarPreview, 'avatar')
            const response = await consumerApiClient.updateConsumer(userData?.uid as string, formData as any);
            
            dispatch(updateUserData({
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                avatarUrl: response.avatar
            }))
            
            ctoast.success('Cập nhật thông tin thành công')
        } catch (error) {
            console.error('Error updating profile:', error)
            ctoast.error('Có lỗi xảy ra khi cập nhật thông tin')
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
                    <FormField
                        control={form.control}
                        name="avatar"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Profile Picture</FormLabel>
                                <FormControl>
                                    <CImageUploader
                                        defaultFiles={avatarPreview}
                                        onChange={(files, newPreviews, allPreviews) => {
                                            setAvatarPreview(allPreviews)
                                            field.onChange(files)
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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

                    <div className="flex gap-4">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Profile
                        </Button>
                        {isVerified && userType === 'consumer' && (
                            <Button asChild variant="outline">
                                <Link href="/" className="flex items-center gap-2">
                                    Back to Home
                                </Link>
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    )
}
