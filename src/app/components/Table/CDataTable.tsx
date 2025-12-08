'use client'

import React, {useState, useMemo, useCallback} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import {
    Settings2,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    PlusCircle,
    LayoutGrid,
    Search,
    Home,
} from 'lucide-react'
import Link from 'next/link'
import string from "zod/src/v3/benchmarks/string";
import {T} from "tailwindcss/dist/types-WlZgYgM8";

export interface ColumnConfig<T> {
    key: keyof T
    label: string
    render?: (row: T) => React.ReactNode
}

interface BreadcrumbItem {
    label: string
    href?: string
}

interface DataTableProps<T> {
    createPath?: string,
    data: T[],
    columns: ColumnConfig<T>[],
    searchPlaceholder?: string,
    searchKeys?: (keyof T)[],
    statusKey?: keyof T,
    statusOptions?: { value: string; label: string }[],
    pageSizeOptions?: number[],
    loading?: boolean,
    error?: string | null,
    breadcrumbItems?: BreadcrumbItem[],
    rightSlot?: React.ReactNode
}

export function CDataTable<T extends Record<string, any>>({
                                                              createPath,
                                                              data = [],
                                                              columns,
                                                              searchPlaceholder = 'Tìm kiếm...',
                                                              searchKeys = [],
                                                              statusKey,
                                                              statusOptions = [
                                                                  {value: 'all', label: 'Tất cả'},
                                                                  {value: 'active', label: 'Hoạt động'},
                                                                  {value: 'inactive', label: 'Không hoạt động'},
                                                              ],
                                                              pageSizeOptions = [10, 20, 30, 40, 50],
                                                              loading = false,
                                                              error = null,
                                                              breadcrumbItems = [],
                                                              rightSlot
                                                          }: DataTableProps<T>) {
    // State
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
        () => Object.fromEntries(columns.map((col) => [col.key, true]))
    )
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(pageSizeOptions[0] || 10)

    // Filter data
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const matchesSearch =
                searchKeys.length === 0 ||
                searchKeys.some((key) =>
                    String(item[key]).toLowerCase().includes(search.toLowerCase())
                )
            const matchesStatus =
                !statusKey ||
                filterStatus === 'all' ||
                String(item[statusKey]).toLowerCase() === filterStatus.toLowerCase()
            return matchesSearch && matchesStatus
        })
    }, [data, search, filterStatus, searchKeys, statusKey])

    // Pagination
    const totalItems = filteredData.length
    const totalPages = Math.ceil(totalItems / pageSize)

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize
        const endIndex = startIndex + pageSize
        return filteredData.slice(startIndex, endIndex)
    }, [filteredData, currentPage, pageSize])

    const handlePageChange = useCallback(
        (page: number) => {
            if (page >= 1 && page <= totalPages) setCurrentPage(page)
        },
        [totalPages]
    )

    const handlePageSizeChange = useCallback((size: string) => {
        const newSize = Number(size)
        setPageSize(newSize)
        setCurrentPage(1)
    }, [])

    const toggleColumn = useCallback((key: keyof T) => {
        setVisibleColumns((prev) => ({...prev, [key]: !prev[key as string]}))
    }, [])

    // Breadcrumb Component
    const BreadcrumbNavigation = () => {
        if (!breadcrumbItems.length) return null

        return (
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/" className="flex items-center gap-1">
                            <Home size={16}/>
                            Trang chủ
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    {breadcrumbItems.map((item, index) => {
                        const isLast = index === breadcrumbItems.length - 1

                        return (
                            <React.Fragment key={index}>
                                <BreadcrumbItem>
                                    {isLast ? (
                                        <BreadcrumbPage className="font-semibold text-gray-900">
                                            {item.label}
                                        </BreadcrumbPage>
                                    ) : item.href ? (
                                        <BreadcrumbLink
                                            href={item.href}
                                            className="text-gray-600 hover:text-gray-900"
                                        >
                                            {item.label}
                                        </BreadcrumbLink>
                                    ) : (
                                        <span className="text-gray-600">{item.label}</span>
                                    )}
                                </BreadcrumbItem>
                                {!isLast && <BreadcrumbSeparator/>}
                            </React.Fragment>
                        )
                    })}
                </BreadcrumbList>
            </Breadcrumb>
        )
    }

    // Subcomponents
    const StatusFilterButton = () => {
        if (!statusKey) return null
        const currentStatusLabel =
            statusOptions.find((opt) => opt.value === filterStatus)?.label || 'Trạng thái'
        return (
            <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger
                    className={`text-sm font-semibold ${
                        filterStatus !== 'all'
                            ? 'text-green-600 border border-green-600'
                            : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    <div className="flex items-center">
                        <LayoutGrid size={16} className="mr-1 text-green-600"/>
                        <SelectValue>{currentStatusLabel}</SelectValue>
                    </div>
                </SelectTrigger>
                <SelectContent>
                    {statusOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        )
    }

    const HeaderActions = () => (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                    <Input
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-[240px] h-8 pl-10 bg-white border-gray-300"
                    />
                </div>
                {rightSlot && (
                    <div className="ml-2">
                        {rightSlot}
                    </div>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {statusKey && <StatusFilterButton/>}
                {createPath && (
                    <Button
                        asChild
                        variant="outline"
                        className="h-9 px-5 shadow-md"
                    >
                        <Link href={createPath} className="flex items-center gap-1">
                            <PlusCircle size={16}/>
                            Tạo mới
                        </Link>
                    </Button>
                )}
             

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 text-gray-700 border-gray-300"
                        >
                            <Settings2 size={14}/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuLabel>Cột hiển thị</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        {columns
                            .filter((col) => col.key !== 'uid')
                            .map((col) => (
                                <DropdownMenuCheckboxItem
                                    key={String(col.key)}
                                    checked={visibleColumns[col.key as string]}
                                    onCheckedChange={() => toggleColumn(col.key)}
                                >
                                    {col.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )

    const PaginationFooter = () => (
        <div className="flex items-center justify-end space-x-4 py-4 px-2 text-sm text-gray-700 border-t">
            <div className="flex items-center space-x-3">
                <span className="font-semibold">Số hàng mỗi trang</span>
                <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
                    <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder={String(pageSize)}/>
                    </SelectTrigger>
                    <SelectContent>
                        {pageSizeOptions.map((size) => (
                            <SelectItem key={size} value={String(size)}>
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="flex items-center font-semibold">
                    <span>
                        Trang {currentPage} trên {totalPages}
                    </span>
                </div>
            </div>

            <div className="flex items-center space-x-1">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                >
                    <ChevronsLeft className="h-4 w-4"/>
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4"/>
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    <ChevronRight className="h-4 w-4"/>
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    <ChevronsRight className="h-4 w-4"/>
                </Button>
            </div>
        </div>
    )

    // Main return
    return (
        <div className="min-h-screen p-4">
            {loading ? (
                <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                    <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        <span className="text-gray-600">Đang tải dữ liệu...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="text-center text-red-500 py-10">{error}</div>
            ) : (
                <div className="space-y-4">
                    <BreadcrumbNavigation/>

                    <HeaderActions/>

                    <div className="bg-white border rounded-sm overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader className="bg-gray-100 border-b">
                                <TableRow>
                                    {columns
                                        .filter((col) => col.key !== 'uid')
                                        .map(
                                            (col) =>
                                                visibleColumns[col.key as string] && (
                                                    <TableHead
                                                        key={String(col.key)}
                                                        className="text-xs font-semibold text-gray-700 uppercase tracking-wider py-4 px-7 bg-gray-100"
                                                    >
                                                        {col.label}
                                                        <span className="ml-1 text-gray-400">↑↓</span>
                                                    </TableHead>
                                                )
                                        )}
                                    <TableHead className="bg-gray-100 w-[80px]"/>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="bg-white">
                                <AnimatePresence mode="popLayout">
                                    {paginatedData.length ? (
                                        paginatedData.map((item, index) => (
                                            <motion.tr
                                                key={index}
                                                initial={{opacity: 0, y: 5}}
                                                animate={{opacity: 1, y: 0}}
                                                exit={{opacity: 0, y: -5}}
                                                transition={{duration: 0.2}}
                                                className="hover:bg-gray-50 border-b transition-colors duration-150"
                                            >
                                                {columns
                                                    .filter((col) => col.key !== 'uid')
                                                    .map(
                                                        (col) =>
                                                            visibleColumns[col.key as string] && (
                                                                <TableCell
                                                                    key={String(col.key)}
                                                                    className="py-3 px-7 text-sm text-gray-800"
                                                                >
                                                                    {col.render
                                                                        ? col.render(item)
                                                                        : String(item[col.key])}
                                                                </TableCell>
                                                            )
                                                    )}
                                                <TableCell className="py-3 px-4 text-right w-[80px] cursor-pointer">
                                                    {columns.find((col) => col.key === 'uid')?.render?.(
                                                        item
                                                    )}
                                                </TableCell>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={columns.length}
                                                className="text-center py-10 text-gray-500"
                                            >
                                                Không có dữ liệu phù hợp
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </div>

                    {totalItems > 0 && <PaginationFooter/>}
                </div>
            )}
        </div>
    )
}