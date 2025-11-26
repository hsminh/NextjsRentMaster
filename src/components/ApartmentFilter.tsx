'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { toast } from 'sonner';
import { AddressDivisionAPI } from "@/shared/api";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApartmentFilterProps {
    onFilter: (filters: {
        minPrice?: number;
        maxPrice?: number;
        wardDivisionUid?: string;
        provinceDivisionUid?: string;
    }) => void;
}

interface Division {
    uid: string;
    name: string;
}

export function ApartmentFilter({ onFilter }: ApartmentFilterProps) {
    const { handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            minPrice: 0,
            maxPrice: 10000000,
            wardDivisionUid: '',
            provinceDivisionUid: '',
        }
    });

    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
    const [provinces, setProvinces] = useState<Division[]>([]);
    const [wards, setWards] = useState<Division[]>([]);
    const [openProvince, setOpenProvince] = useState(false);
    const [openWard, setOpenWard] = useState(false);

    const selectedProvince = watch('provinceDivisionUid');
    const selectedWard = watch('wardDivisionUid');

    const selectedProvinceObj = provinces.find(p => p.uid === selectedProvince);
    const selectedWardObj = wards.find(w => w.uid === selectedWard);
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const api = new AddressDivisionAPI();
                const data = await api.listProvinces();
                setProvinces(data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
                toast.error('Không tải được danh sách tỉnh/thành');
            }
        };

        fetchProvinces();
    }, []);

    useEffect(() => {
        if (!selectedProvince) {
            setWards([]);
            setValue('wardDivisionUid', '');
            return;
        }

        const fetchWards = async () => {
            try {
                const api = new AddressDivisionAPI();
                const data = await api.listWards(selectedProvince);
                setWards(data);
            } catch (error) {
                console.error('Error fetching wards:', error);
                toast.error('Không tải được danh sách phường/xã');
            }
        };

        fetchWards();
    }, [selectedProvince, setValue]);

    useEffect(() => {
        setValue('minPrice', priceRange[0]);
        setValue('maxPrice', priceRange[1]);
    }, [priceRange, setValue]);

    const onSubmit = (data: any) => {

        onFilter({
            minPrice: data.minPrice,
            maxPrice: data.maxPrice,
            wardDivisionUid: data.wardDivisionUid || undefined,
            provinceDivisionUid: data.provinceDivisionUid || undefined,
        });
    };

    const resetFilters = () => {
        setPriceRange([0, 10000000]);
        setValue('provinceDivisionUid', '');
        setValue('wardDivisionUid', '');
        setWards([]);
        setOpenProvince(false);
        setOpenWard(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 border rounded-xl bg-card shadow-sm">
            <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Bộ lọc tìm kiếm
                </h3>

                <div className="space-y-4">
                    <div className="space-y-3">
                        <Label htmlFor="price-range" className="text-sm font-medium">
                            Khoảng giá (VND)
                        </Label>
                        <div className="flex items-center gap-3">
                            <div className="flex-1">
                                <Input
                                    type="number"
                                    placeholder="Từ"
                                    value={priceRange[0]}
                                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                    className="text-sm"
                                />
                            </div>
                            <span className="text-muted-foreground">-</span>
                            <div className="flex-1">
                                <Input
                                    type="number"
                                    placeholder="Đến"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                    className="text-sm"
                                />
                            </div>
                        </div>
                        <Slider
                            value={priceRange}
                            onValueChange={(value) => setPriceRange([value[0], value[1]])}
                            min={0}
                            max={10000000}
                            step={100000}
                            className="mt-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0 VND</span>
                            <span>10.000.000 VND</span>
                        </div>
                    </div>

                    {/* Province Combobox */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Tỉnh/Thành phố</Label>
                        <Popover open={openProvince} onOpenChange={setOpenProvince}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openProvince}
                                    className="w-full justify-between h-10 border-input hover:bg-accent/50 transition-colors"
                                >
        <span
            className={cn(
                "truncate",
                selectedProvinceObj ? "text-foreground" : "text-muted-foreground"
            )}
        >
          {selectedProvinceObj ? selectedProvinceObj.name : "Chọn tỉnh/thành phố..."}
        </span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 shadow-lg border" align="start">
                                <Command>
                                    <CommandInput
                                        placeholder="Tìm kiếm tỉnh/thành phố..."
                                        className="h-11 border-b"
                                    />
                                    <CommandList className="max-h-64">
                                        <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                                            Không tìm thấy tỉnh/thành phố phù hợp.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {provinces.map((province) => (
                                                <CommandItem
                                                    key={province.uid}
                                                    value={province.name}
                                                    onSelect={() => {
                                                        setValue('provinceDivisionUid', province.uid, { shouldDirty: true, shouldTouch: true });
                                                        setOpenProvince(false);
                                                    }}
                                                    className="py-2.5 px-3 text-sm cursor-pointer transition-colors hover:bg-accent"
                                                >
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <span className="flex-1">{province.name}</span>
                                                    </div>
                                                    <Check
                                                        className={cn(
                                                            "h-4 w-4 flex-shrink-0",
                                                            selectedProvince === province.uid ? "opacity-100 text-primary" : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>


                    {/* Ward Combobox */}
                    {/* Ward Combobox */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Phường/Xã</Label>
                        <Popover open={openWard} onOpenChange={setOpenWard}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openWard}
                                    className="w-full justify-between h-10 border-input hover:bg-accent/50 transition-colors"
                                    disabled={!selectedProvince}
                                >
        <span
            className={cn(
                "truncate",
                selectedWardObj ? "text-foreground" : "text-muted-foreground"
            )}
        >
          {selectedWardObj ? selectedWardObj.name : "Chọn phường/xã..."}
        </span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 shadow-lg border" align="start">
                                <Command>
                                    <CommandInput
                                        placeholder="Tìm kiếm phường/xã..."
                                        className="h-11 border-b"
                                        disabled={!selectedProvince}
                                    />
                                    <CommandList className="max-h-64">
                                        <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                                            {!selectedProvince
                                                ? "Vui lòng chọn tỉnh/thành phố trước"
                                                : "Không tìm thấy phường/xã phù hợp."
                                            }
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {wards.map((ward) => (
                                                <CommandItem
                                                    key={ward.uid}
                                                    value={ward.name}
                                                    onSelect={() => {
                                                        setValue('wardDivisionUid', ward.uid, { shouldDirty: true, shouldTouch: true });
                                                        setOpenWard(false);
                                                    }}
                                                    className="py-2.5 px-3 text-sm cursor-pointer transition-colors hover:bg-accent"
                                                >
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <span className="flex-1">{ward.name}</span>
                                                    </div>
                                                    <Check
                                                        className={cn(
                                                            "h-4 w-4 flex-shrink-0",
                                                            selectedWard === ward.uid ? "opacity-100 text-primary" : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={resetFilters}
                    className="flex-1 sm:flex-none"
                >
                    Đặt lại
                </Button>
                <Button
                    type="submit"
                    className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
                >
                Áp dụng bộ lọc
                </Button>
            </div>
        </form>
    );
}