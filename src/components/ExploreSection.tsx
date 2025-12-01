"use client";

import { useState } from "react";
import { ApartmentFilter } from "@/components/ApartmentFilter";
import ApartmentsSection from "@/components/ApartmentsSection";
import RoomsSection from "@/components/RoomsSection";
import { ApartmentRequest } from "@/app/landlord/apartments/type/apartment";
import { ApartmentRoomRequest } from "@/app/landlord/rooms/type/apartment";

type SharedFilters = {
    minPrice?: number;
    maxPrice?: number;
    wardDivisionUid?: string;
    provinceDivisionUid?: string;
    streetUid?: string;
    provinceName?: string;
};

interface ExploreSectionProps {
    initialApartments: ApartmentRequest[];
    initialRooms: ApartmentRoomRequest[];
}

const ExploreSection = ({
                            initialApartments,
                            initialRooms,
                        }: ExploreSectionProps) => {
    const [filters, setFilters] = useState<SharedFilters>({});
    const [collapsed, setCollapsed] = useState(false);

    const handleFilter = async (f: SharedFilters) => {
        setFilters(f);
    };

    const handleClear = () => {
        setFilters({});
    };

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className="space-y-12">
            <div className="border rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-between mb-4 gap-2">
                    <div>
                        <h2 className="text-xl font-semibold">Bộ lọc tìm kiếm</h2>
                        <p className="text-sm text-muted-foreground">
                            Áp dụng đồng thời cho cả căn hộ & phòng trọ
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {Object.keys(filters).length > 0 && (
                            <button
                                onClick={handleClear}
                                className="text-sm underline text-muted-foreground hover:text-foreground"
                            >
                                Xóa bộ lọc
                            </button>
                        )}
                        <button
                            onClick={toggleCollapsed}
                            className="text-sm underline text-muted-foreground hover:text-foreground"
                        >
                            {collapsed ? "Mở bộ lọc" : "Thu gọn bộ lọc"}
                        </button>
                    </div>
                </div>

                {!collapsed && (
                    <ApartmentFilter
                        onFilter={handleFilter}
                    />
                )}
            </div>

            <ApartmentsSection
                initialApartments={initialApartments}
                sharedFilters={filters}
            />

            <RoomsSection
                initialRooms={initialRooms}
                sharedFilters={filters}
            />
        </div>
    );
};

export default ExploreSection;
