'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Loader2, Check, ChevronsUpDown, MapPin } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { NumberInput } from '@/components/ui/number-input'
import ctoast from '@/components/ui/Toast'
import CImageUploader from '@/components/ui/CImageUploader'

import { apartmentFormSchema, ApartmentFormValues } from '@/app/landlord/apartments/type/validations/apartment'
import { isBlobUrl, revokePreviewUrl } from '@/app/utils/image-utils'
import { createFormData } from '@/app/utils/form-utils'

import { AddressInterface } from '@/shared/types/response/address'
import { AddressDivisionAPI } from '@/shared/api'

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {ApartmentStatus, ApartmentType} from "@/app/landlord/apartments/type/apartment-enums";
import {ApartmentAPI} from "@/app/landlord/apartments/api";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ApartmentRequest} from "@/app/landlord/apartments/type/apartment";

interface ApartmentFormProps {
    initialData?: ApartmentRequest
    isEdit?: boolean
    isDetails?: boolean
}

export function ApartmentForm({ initialData, isEdit = false, isDetails = false }: ApartmentFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [previewFiles, setPreviewFiles] = useState<string[]>([])
    const [provinces, setProvinces] = useState<AddressInterface[]>([])
    const [wards, setWards] = useState<AddressInterface[]>([])
    const [streets, setStreets] = useState<AddressInterface[]>([])
    const [loadingWards, setLoadingWards] = useState(false)
    const [loadingStreets, setLoadingStreets] = useState(false)

    // State for popovers
    const [openProvince, setOpenProvince] = useState(false)
    const [openWard, setOpenWard] = useState(false)
    const [openStreet, setOpenStreet] = useState(false)

    const formTitle = isDetails ? 'Chi tiết căn hộ' : isEdit ? 'Chỉnh sửa căn hộ' : 'Tạo căn hộ mới'

    const form = useForm<ApartmentFormValues>({
        resolver: zodResolver(apartmentFormSchema),
        defaultValues: {
            title: initialData?.title ?? '',
            description: initialData?.description ?? '',
            price: initialData?.price ?? 0,
            areaLength: initialData?.areaLength ?? 0,
            areaWidth: initialData?.areaWidth ?? 0,
            type: initialData?.type ?? ApartmentType.FULL_APARTMENT,
            status: initialData?.status ?? ApartmentStatus.AVAILABLE,
            Files: initialData?.images ?? [],
            provinceDivisionUid: initialData?.provinceDivisionUid ?? undefined,
            wardDivisionUid: initialData?.wardDivisionUid ?? undefined,
            streetUid: initialData?.streetUid ?? undefined,
            MetaData: initialData?.metaData ?? '',
        },
    })

    const currentType = form.watch('type')
    const selectedProvince = form.watch('provinceDivisionUid')
    const selectedWard = form.watch('wardDivisionUid')
    const isDisabled = isDetails || isLoading

    useEffect(() => {
        return () => {
            previewFiles.forEach(url => {
                if (isBlobUrl(url)) revokePreviewUrl(url)
            })
        }
    }, [previewFiles])

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const api = new AddressDivisionAPI()
                const data = await api.listProvinces()
                setProvinces(data)
            } catch (e) {
                console.error(e)
                ctoast.error('Không tải được danh sách tỉnh/thành')
            }
        }
        fetchProvinces()
    }, [])

    // Load wards khi province thay đổi
    useEffect(() => {
        if (!selectedProvince) {
            setWards([])
            setStreets([])
            form.setValue('wardDivisionUid', '')
            form.setValue('streetUid','')
            return
        }

        const fetchWards = async () => {
            setLoadingWards(true)
            try {
                const api = new AddressDivisionAPI()
                const data = await api.listWards(selectedProvince)
                setWards(data)
                form.setValue('wardDivisionUid','')
                form.setValue('streetUid','')
                setStreets([])
            } catch (e) {
                console.error(e)
                ctoast.error('Không tải được danh sách phường/xã')
                setWards([])
            } finally {
                setLoadingWards(false)
            }
        }

        fetchWards()
    }, [selectedProvince, form])

    useEffect(() => {
        if (!selectedWard) {
            setStreets([])
            form.setValue('streetUid','')
            return
        }

        const fetchStreets = async () => {
            setLoadingStreets(true)
            try {
                const api = new AddressDivisionAPI()
                const data = await api.listStreets(selectedWard)
                setStreets(data)
                // Reset street khi ward thay đổi
                form.setValue('streetUid','')
            } catch (e) {
                console.error(e)
                ctoast.error('Không tải được danh sách đường')
                setStreets([])
            } finally {
                setLoadingStreets(false)
            }
        }

        fetchStreets()
    }, [selectedWard, form])

    useEffect(() => {
        if ((isEdit || isDetails) && initialData?.images?.length) {
            const images = initialData.images ?? []
            setPreviewFiles(images)
            form.setValue('Files', images)
        }
    }, [initialData?.images, isEdit, isDetails, form])

    useEffect(() => {
        if (isEdit && initialData) {
            const loadInitialAddressData = async () => {
                if (!initialData.provinceDivisionUid) return;

                try {
                    const api = new AddressDivisionAPI()

                    // Load wards for the province
                    const wardsData = await api.listWards(initialData.provinceDivisionUid)
                    setWards(wardsData)

                    if (initialData.wardDivisionUid) {
                        form.setValue('wardDivisionUid', initialData.wardDivisionUid)

                        const streetsData = await api.listStreets(initialData.wardDivisionUid)
                        setStreets(streetsData)
                        
                        if (initialData.streetUid) {
                            setTimeout(() => {
                                form.setValue('streetUid', initialData.streetUid as any)
                            }, 100)
                        }
                    }
                } catch (e) {
                    console.error('Error loading initial address data:', e)
                    ctoast.error('Không tải được thông tin địa chỉ')
                }
            }

            loadInitialAddressData()
        }
    }, [isEdit, initialData, form])

    const onSubmit = async (values: ApartmentFormValues) => {
        if (isDetails) return

        setIsLoading(true)
        try {
            const api = new ApartmentAPI()
            const formData = await createFormData(values, values.Files || [])

            if (isEdit && initialData?.uid) {
                await api.update(initialData.uid, formData)
                ctoast.success('Cập nhật căn hộ thành công')
            } else {
                await api.create(formData)
                ctoast.success('Tạo căn hộ thành công')
                router.push('/landlord/apartments')
                router.refresh()
            }
        } catch (error: any) {
            console.error(error)
            ctoast.error(error?.message || 'Đã xảy ra lỗi khi lưu thông tin')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-900">{formTitle}</h1>
                <p className="text-gray-600 mt-1">
                    {isDetails
                        ? 'Xem thông tin chi tiết về căn hộ'
                        : isEdit
                            ? 'Chỉnh sửa thông tin căn hộ hiện có'
                            : 'Thêm thông tin căn hộ mới vào hệ thống'}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tiêu đề</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập tiêu đề căn hộ" {...field} disabled={isDisabled} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Giá thuê (VNĐ/tháng)</FormLabel>
                                    <FormControl>
                                        <NumberInput {...field} disabled={isDisabled} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="areaLength"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Chiều dài (m)</FormLabel>
                                    <FormControl>
                                        <NumberInput {...field} disabled={isDisabled} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="areaWidth"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Chiều rộng (m)</FormLabel>
                                    <FormControl>
                                        <NumberInput {...field} disabled={isDisabled} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Address Section với Command/Popover */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Province */}
                        <FormField
                            control={form.control}
                            name="provinceDivisionUid"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Tỉnh / Thành phố</FormLabel>
                                    <Popover open={openProvince} onOpenChange={setOpenProvince}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openProvince}
                                                    className={cn(
                                                        "w-full justify-between h-10",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    disabled={isDisabled}
                                                >
                                                    <span className="truncate">
                                                        {field.value
                                                            ? provinces.find((province) => province.uid === field.value)?.name
                                                            : "Chọn tỉnh/thành phố"}
                                                    </span>
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0" align="start">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Tìm kiếm tỉnh/thành phố..."
                                                    className="h-9"
                                                />
                                                <CommandList>
                                                    <CommandEmpty>Không tìm thấy tỉnh/thành phố.</CommandEmpty>
                                                    <CommandGroup>
                                                        {provinces.map((province) => (
                                                            <CommandItem
                                                                key={province.uid}
                                                                value={province.name}
                                                                onSelect={() => {
                                                                    form.setValue('provinceDivisionUid', province.uid)
                                                                    setOpenProvince(false)
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        province.uid === field.value ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                                                {province.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Ward */}
                        <FormField
                            control={form.control}
                            name="wardDivisionUid"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Quận / Huyện / Phường</FormLabel>
                                    <Popover open={openWard} onOpenChange={setOpenWard}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openWard}
                                                    className={cn(
                                                        "w-full justify-between h-10",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    disabled={isDisabled || !selectedProvince || loadingWards}
                                                >
                                                    {loadingWards ? (
                                                        <div className="flex items-center gap-2">
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                            <span>Đang tải...</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span className="truncate">
                                                                {field.value
                                                                    ? wards.find((ward) => ward.uid === field.value)?.name
                                                                    : selectedProvince
                                                                        ? "Chọn quận/huyện/phường"
                                                                        : "Chọn tỉnh/thành trước"}
                                                            </span>
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </>
                                                    )}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0" align="start">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Tìm kiếm quận/huyện/phường..."
                                                    className="h-9"
                                                    disabled={!selectedProvince}
                                                />
                                                <CommandList>
                                                    <CommandEmpty>
                                                        {!selectedProvince
                                                            ? "Vui lòng chọn tỉnh/thành trước"
                                                            : "Không tìm thấy quận/huyện/phường."}
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {wards.map((ward) => (
                                                            <CommandItem
                                                                key={ward.uid}
                                                                value={ward.name}
                                                                onSelect={() => {
                                                                    form.setValue('wardDivisionUid', ward.uid)
                                                                    setOpenWard(false)
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        ward.uid === field.value ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                                                {ward.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Street */}
                        <FormField
                            control={form.control}
                            name="streetUid"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Đường / Phố</FormLabel>
                                    <Popover open={openStreet} onOpenChange={setOpenStreet}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openStreet}
                                                    className={cn(
                                                        "w-full justify-between h-10",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {loadingStreets ? (
                                                        <div className="flex items-center gap-2">
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                            <span>Đang tải...</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span className="truncate">
                                                                {field.value
                                                                    ? streets.find((street) => street.uid === field.value)?.name
                                                                    : selectedWard
                                                                        ? "Chọn đường/phố"
                                                                        : "Chọn quận/huyện trước"}
                                                            </span>
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </>
                                                    )}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0" align="start">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Tìm kiếm đường/phố..."
                                                    className="h-9"
                                                    disabled={!selectedWard}
                                                />
                                                <CommandList>
                                                    <CommandEmpty>
                                                        {!selectedWard
                                                            ? "Vui lòng chọn quận/huyện trước"
                                                            : "Không tìm thấy đường/phố."}
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {streets.map((street) => (
                                                            <CommandItem
                                                                key={street.uid}
                                                                value={street.name}
                                                                onSelect={() => {
                                                                    form.setValue('streetUid', street.uid)
                                                                    setOpenStreet(false)
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        street.uid === field.value ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                                                {street.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="MetaData"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Số nhà / Địa chỉ chi tiết</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value ?? ''}
                                        placeholder="Ví dụ: Số 123, Ngõ 45"
                                        disabled={isDisabled}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mô tả chi tiết</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        value={field.value ?? ''}
                                        className="min-h-32"
                                        placeholder="Mô tả về căn hộ, tiện ích, nội thất..."
                                        disabled={isDisabled}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loại căn hộ</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange} disabled={isDisabled}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn loại căn hộ" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.entries(ApartmentType).map(([key, value]) => (
                                            <SelectItem key={value} value={value}>
                                                {key === 'FULL_APARTMENT' ? 'Căn hộ nguyên căn' :
                                                    key === 'ROOM_BASED' ? 'Phòng trọ' : value}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {currentType === ApartmentType.FULL_APARTMENT ? (
                        <FormField
                            control={form.control}
                            name="Files"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hình ảnh căn hộ (tối đa 10 ảnh)</FormLabel>
                                    <FormControl>
                                        <CImageUploader
                                            multiple
                                            defaultFiles={previewFiles}
                                            onChange={(files, newPreviews, allPreviews) => {
                                                setPreviewFiles(allPreviews)
                                                form.setValue('Files', allPreviews, { shouldValidate: true })
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ) : (
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4">
                            <strong>Lưu ý:</strong> Với loại "Chung chủ", bạn sẽ thêm ảnh cho từng phòng riêng sau khi tạo căn hộ
                            chính.
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push('/landlord/apartments')}
                            disabled={isLoading}
                        >
                            {isDetails ? 'Đóng' : 'Hủy'}
                        </Button>

                        {!isDetails && (
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang lưu...
                                    </>
                                ) : isEdit ? (
                                    'Cập nhật'
                                ) : (
                                    'Tạo mới'
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    )
}