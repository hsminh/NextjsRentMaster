'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { FileText, Calendar, Phone, Mail, User, CreditCard, ChevronRight, Zap, ExternalLink, CheckCircle, Loader } from 'lucide-react'
import { contractAPI, MyContract, contactAPI, MyRental, paymentAPI, PaymentItem } from './api'
import { useAppSelector } from '@/store'
import confetti from 'canvas-confetti'

export default function MyHomesLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const orderId = searchParams.get('orderId')
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed' | null>(null)
    const [checking, setChecking] = useState(false)
    const [contracts, setContracts] = useState<MyContract[]>([])
    const [rentals, setRentals] = useState<MyRental[]>([])
    const [payments, setPayments] = useState<PaymentItem[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'contact' | 'contract' | 'payment'>('contact')
    const [selectedContact, setSelectedContact] = useState<MyRental | null>(null)
    const [selectedContract, setSelectedContract] = useState<MyContract | null>(null)
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [paymentLoading, setPaymentLoading] = useState(false)
    const [paymentError, setPaymentError] = useState<string | null>(null)
    const { isLoggedIn, userType } = useAppSelector((state) => ({
        isLoggedIn: state.auth.isLoggedIn,
        userType: state.auth.userType
    }))

    useEffect(() => {
        if (!orderId) return

        console.log('[Layout] Payment check starting, orderId:', orderId)
        setChecking(true)

        const checkPayment = async () => {
            try {
                const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5279'}/api/payments/${orderId}/status`
                const token = localStorage.getItem('access_token')

                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                })

                if (!response.ok) {
                    console.error('[Layout] Payment check failed')
                    setPaymentStatus('failed')
                    setChecking(false)
                    return
                }

                const data = await response.json()
                console.log('[Layout] Payment response:', data)

                if (data.status === 'success') {
                    console.log('[Layout] ✅ Payment success!')
                    setPaymentStatus('success')
                    setChecking(false)

                    try {
                        for (let i = 0; i < 6; i++) {
                            setTimeout(() => {
                                confetti({
                                    particleCount: 200,
                                    spread: 120,
                                    origin: { x: Math.random(), y: Math.random() * 0.5 },
                                    zIndex: 99999,
                                })
                            }, i * 200)
                        }
                    } catch (e) {
                        console.log('[Layout] Confetti error:', e)
                    }

                    setTimeout(() => {
                        setPaymentStatus(null)
                        router.refresh()
                    }, 5000)
                } else {
                    setPaymentStatus('pending')
                    setChecking(false)
                }
            } catch (error) {
                console.error('[Layout] Payment check error:', error)
                setPaymentStatus('failed')
                setChecking(false)
            }
        }

        const timeout = setTimeout(checkPayment, 300)
        return () => clearTimeout(timeout)
    }, [orderId, router])

    useEffect(() => {
        fetchData()
    }, [isLoggedIn, userType])

    const fetchData = async () => {
        try {
            setLoading(true);

            const [
                contractsData,
                rentalsData,
                paymentsRes
            ] = await Promise.all([
                contractAPI.getContracts(),
                contactAPI.getMyRentals(),
                paymentAPI.getPaymentHistory()
            ]);

            setContracts(contractsData);
            setRentals(rentalsData);
            setPayments(paymentsRes.data);

            if (rentalsData.length > 0) setSelectedContact(rentalsData[0]);
            if (contractsData.length > 0) setSelectedContract(contractsData[0]);
            if (paymentsRes.data.length > 0) setSelectedPayment(paymentsRes.data[0]);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (activeTab === 'contact' && rentals.length > 0 && !selectedContact) {
            setSelectedContact(rentals[0])
        } else if (activeTab === 'contract' && contracts.length > 0 && !selectedContract) {
            setSelectedContract(contracts[0])
        } else if (activeTab === 'payment' && payments.length > 0 && !selectedPayment) {
            setSelectedPayment(payments[0])
        }
    }, [activeTab])

    const handleSelectContact = async (rental: MyRental) => {
        setSelectedContact(rental)
    }

    const handleSelectContract = async (contract: MyContract) => {
        setSelectedContract(contract)
    }

    const handleSelectPayment = async (payment: PaymentItem) => {
        setSelectedPayment(payment)
    }

    const handlePayment = async (contractUid: string) => {
        try {
            setPaymentLoading(true)
            setPaymentError(null)

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5279'}/consumer/api/rental-payments/momo/create/${contractUid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                credentials: 'include'
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Thanh toán thất bại')
            }

            if (data.success && data.data?.payUrl) {
                window.location.href = data.data.payUrl
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra'
            setPaymentError(errorMessage)
            console.error('Payment error:', error)
        } finally {
            setPaymentLoading(false)
        }
    }

    const filteredContracts = statusFilter === 'all'
        ? contracts
        : contracts.filter(c => c.status === statusFilter)

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            {/* PAYMENT SUCCESS - FULL SCREEN */}
            {paymentStatus === 'success' && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full mx-4 text-center animate-bounce">
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 bg-green-200 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-14 h-14 text-green-600" />
                            </div>
                        </div>
                        <h2 className="text-4xl font-bold text-green-900 mb-3">🎉 Thành công!</h2>
                        <p className="text-green-700 text-lg mb-6">Thanh toán của bạn đã được xác nhận</p>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-800 text-sm">Hệ thống đang cập nhật dữ liệu...</p>
                        </div>
                    </div>
                </div>
            )}

            {/* PAYMENT CHECKING */}
            {checking && !paymentStatus && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Loader className="w-6 h-6 animate-spin text-primary" />
                            <p className="text-lg font-semibold text-gray-900">Đang xác nhận thanh toán...</p>
                        </div>
                        <p className="text-gray-600 text-sm">Vui lòng đợi một chút</p>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                    {/* LEFT SIDEBAR - NAVIGATION TABS */}
                    <aside className="h-fit sticky top-28">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                            {/* TAB NAVIGATION - VERTICAL */}
                            <div className="flex flex-col border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white">
                                {[
                                    { id: 'contact', label: 'Liên hệ', icon: User, color: 'blue', borderClass: 'border-blue-500', activeClass: 'text-blue-600 bg-blue-50' },
                                    { id: 'contract', label: 'Hợp đồng', icon: FileText, color: 'primary', borderClass: 'border-primary', activeClass: 'text-primary bg-primary/5' },
                                    { id: 'payment', label: 'Thanh toán', icon: CreditCard, color: 'green', borderClass: 'border-green-500', activeClass: 'text-green-600 bg-green-50' }
                                ].map((tab) => {
                                    const Icon = tab.icon
                                    const isActive = activeTab === tab.id
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={cn(
                                                'w-full px-4 py-3 flex items-center gap-3 border-l-4 transition-all text-sm font-medium hover:bg-gray-100',
                                                isActive
                                                    ? `border-l-4 ${tab.borderClass} ${tab.activeClass}`
                                                    : 'border-transparent text-gray-700'
                                            )}
                                        >
                                            <Icon className="w-5 h-5 flex-shrink-0" />
                                            <span>{tab.label}</span>
                                        </button>
                                    )
                                })}
                            </div>

                            {/* FILTER FOR CONTRACT TAB */}
                            {activeTab === 'contract' && (
                                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-white">
                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">Lọc theo trạng thái</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white hover:border-gray-400 transition-colors"
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="Active">✅ Hoạt động</option>
                                        <option value="Pending">⏳ Chờ duyệt</option>
                                        <option value="Completed">✓ Hoàn tất</option>
                                    </select>
                                </div>
                            )}

                            {/* CONTENT AREA */}
                            <div className="max-h-[600px] overflow-y-auto">
                                {loading ? (
                                    <div className="p-4 space-y-2">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        {/* CONTACT LIST */}
                                        {activeTab === 'contact' && (
                                            <>
                                                {rentals.length === 0 ? (
                                                    <div className="p-4 text-center text-gray-500 text-sm">Chưa có liên hệ</div>
                                                ) : (
                                                    <nav className="divide-y divide-gray-200">
                                                        {rentals.map((rental) => (
                                                            <button
                                                                key={rental.uid}
                                                                onClick={() => handleSelectContact(rental)}
                                                                className={cn(
                                                                    'w-full text-left p-4 transition-all border-l-4 border-b border-gray-100 hover:shadow-sm',
                                                                    selectedContact?.uid === rental.uid
                                                                        ? 'border-l-blue-500 bg-blue-50 hover:bg-blue-50'
                                                                        : 'border-l-transparent hover:bg-gray-50'
                                                                )}
                                                            >
                                                                <p className="font-semibold text-sm text-gray-900 line-clamp-1">
                                                                    {rental.consumer.firstName} {rental.consumer.lastName}
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                                                                    <Phone className="w-3 h-3 flex-shrink-0" />
                                                                    <span className="truncate">{rental.consumer.phoneNumber}</span>
                                                                </p>
                                                            </button>
                                                        ))}
                                                    </nav>
                                                )}
                                            </>
                                        )}

                                        {/* CONTRACT LIST */}
                                        {activeTab === 'contract' && (
                                            <>
                                                {filteredContracts.length === 0 ? (
                                                    <div className="p-4 text-center text-gray-500 text-sm">Chưa có hợp đồng</div>
                                                ) : (
                                                    <nav className="divide-y divide-gray-200">
                                                        {filteredContracts.map((contract) => (
                                                            <button
                                                                key={contract.uid}
                                                                onClick={() => handleSelectContract(contract)}
                                                                className={cn(
                                                                    'w-full text-left p-4 transition-all border-l-4 border-b border-gray-100 hover:shadow-sm',
                                                                    selectedContract?.uid === contract.uid
                                                                        ? 'border-l-primary bg-primary/5 hover:bg-primary/5'
                                                                        : 'border-l-transparent hover:bg-gray-50'
                                                                )}
                                                            >
                                                                <p className="font-semibold text-sm text-gray-900 line-clamp-1">
                                                                    {contract.apartmentDetails.title}
                                                                </p>
                                                                <p className="text-xs text-gray-600 mt-2 font-medium">
                                                                    {contract.monthlyPrice.toLocaleString('vi-VN')} đ/tháng
                                                                </p>
                                                                <span className={cn(
                                                                    'text-xs px-2 py-0.5 rounded-full inline-block mt-2',
                                                                    contract.status === 'Active'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : contract.status === 'Pending'
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                )}>
                                                                    {contract.status === 'Active' ? '✅ Hoạt động' : contract.status === 'Pending' ? '⏳ Chờ duyệt' : contract.status}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </nav>
                                                )}
                                            </>
                                        )}

                                        {/* PAYMENT LIST */}
                                        {activeTab === 'payment' && (
                                            <>
                                                {payments.length === 0 ? (
                                                    <div className="p-4 text-center text-gray-500 text-sm">Chưa có thanh toán</div>
                                                ) : (
                                                    <nav className="divide-y divide-gray-200">
                                                        {payments.map((payment) => {
                                                            const isPaid = payment.isPaid
                                                            const monthYear = `Tháng ${payment.month}/${payment.year}`
                                                            return (
                                                                <button
                                                                    key={payment.uid}
                                                                    onClick={() => handleSelectPayment(payment)}
                                                                    className={cn(
                                                                        'w-full text-left p-4 transition-all border-l-4 border-b border-gray-100 hover:shadow-sm',
                                                                        selectedPayment?.uid === payment.uid
                                                                            ? 'border-l-green-500 bg-green-50 hover:bg-green-50'
                                                                            : 'border-l-transparent hover:bg-gray-50'
                                                                    )}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <p className="font-bold text-sm text-gray-900">
                                                                            {payment.amount.toLocaleString('vi-VN')} đ
                                                                        </p>
                                                                        <span className={cn(
                                                                            'text-xs px-2.5 py-1 rounded-full font-semibold',
                                                                            isPaid
                                                                                ? 'bg-green-100 text-green-800'
                                                                                : 'bg-yellow-100 text-yellow-800'
                                                                        )}>
                                                                            {isPaid ? '✅ Đã' : '⏳'}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs text-gray-500 mt-2 font-medium">
                                                                        {monthYear}
                                                                    </p>
                                                                </button>
                                                            )
                                                        })}
                                                    </nav>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* RIGHT SIDEBAR - DETAILS */}
                    <aside className="h-fit sticky top-28">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                            <div className="p-6 space-y-5">
                                {/* CONTACT DETAILS */}
                                {activeTab === 'contact' && selectedContact ? (
                                    <>
                                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Họ tên</p>
                                            <p className="text-lg font-bold text-gray-900">
                                                {selectedContact.consumer.firstName} {selectedContact.consumer.lastName}
                                            </p>
                                        </div>

                                        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                                            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide flex items-center gap-1 mb-2">
                                                <Phone className="w-3 h-3" />
                                                Điện thoại
                                            </p>
                                            <p className="text-sm font-medium text-gray-900">{selectedContact.consumer.phoneNumber}</p>
                                        </div>

                                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide flex items-center gap-1 mb-2">
                                                <Mail className="w-3 h-3" />
                                                Email
                                            </p>
                                            <p className="text-sm text-gray-900 break-all font-medium">{selectedContact.consumer.gmail}</p>
                                        </div>

                                        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                                            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2">Căn hộ</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedContact.realEstateUnit.title}</p>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Trạng thái</p>
                                            <span className={cn(
                                                'text-xs px-3 py-1.5 rounded-full inline-block font-semibold',
                                                selectedContact.status === 'Active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : selectedContact.status === 'Pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            )}>
                                                {selectedContact.status === 'Active' ? '✅ Hoạt động' : selectedContact.status === 'Pending' ? '⏳ Chờ duyệt' : selectedContact.status}
                                            </span>
                                        </div>
                                    </>
                                ) : activeTab === 'contact' ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <User className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                        <p className="text-sm">Chọn liên hệ để xem chi tiết</p>
                                    </div>
                                ) : null}

                                {/* CONTRACT DETAILS */}
                                {activeTab === 'contract' && selectedContract ? (
                                    <>
                                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
                                            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Căn hộ</p>
                                            <p className="text-lg font-bold text-gray-900 line-clamp-2">
                                                {selectedContract.apartmentDetails.title}
                                            </p>
                                        </div>

                                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">Thông tin tài chính</p>
                                            <div className="space-y-2.5 text-sm">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 font-medium">Giá hàng tháng:</span>
                                                    <span className="font-bold text-primary">{selectedContract.monthlyPrice.toLocaleString('vi-VN')} đ</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 font-medium">Tiền cọc:</span>
                                                    <span className="font-bold text-gray-900">{selectedContract.depositAmount.toLocaleString('vi-VN')} đ</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                                            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-3">Thời gian</p>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2 text-gray-900 font-medium">
                                                    <Calendar className="w-4 h-4 text-orange-600" />
                                                    <span>Bắt đầu: {new Date(selectedContract.startDate).toLocaleDateString('vi-VN')}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-900 font-medium">
                                                    <Calendar className="w-4 h-4 text-orange-600" />
                                                    <span>Kết thúc: {new Date(selectedContract.endDate).toLocaleDateString('vi-VN')}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">Diện tích</p>
                                                <p className="text-sm font-bold text-gray-900">
                                                    {(selectedContract.apartmentDetails.areaLength * selectedContract.apartmentDetails.areaWidth).toFixed(2)} m²
                                                </p>
                                            </div>

                                            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Loại</p>
                                                <p className="text-sm font-bold text-gray-900">
                                                    {selectedContract.type === 'FullApartment' ? '🏠 Căn hộ' : '🛏️ Phòng trọ'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Trạng thái</p>
                                            <span className={cn(
                                                'text-xs px-3 py-1.5 rounded-full inline-block font-semibold',
                                                selectedContract.status === 'Active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : selectedContract.status === 'Pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            )}>
                                                {selectedContract.status === 'Active' ? '✅ Hoạt động' : selectedContract.status === 'Pending' ? '⏳ Chờ duyệt' : selectedContract.status}
                                            </span>
                                        </div>

                                        {paymentError && (
                                            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                                                <p className="text-sm text-red-700 font-medium">{paymentError}</p>
                                            </div>
                                        )}

                                        <div className="border-t-2 border-gray-200 pt-5 mt-2">
                                            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <CreditCard className="w-5 h-5 text-primary" />
                                                Lịch sử thanh toán
                                            </h3>

                                            {payments.filter(p => p.rentalContractUid === selectedContract.uid).length > 0 ? (
                                                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                                                    {payments.filter(p => p.rentalContractUid === selectedContract.uid).map((payment) => (
                                                        <div key={payment.uid} className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div>
                                                                    <p className="text-sm font-bold text-gray-900">{payment.amount.toLocaleString('vi-VN')} đ</p>
                                                                    <p className="text-xs text-gray-600">Tháng {payment.month}/{payment.year}</p>
                                                                </div>
                                                                <span className={cn(
                                                                    'text-xs px-3 py-1.5 rounded-full font-semibold border',
                                                                    payment.isPaid
                                                                        ? 'bg-green-100 text-green-700 border-green-300'
                                                                        : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                                                )}>
                                                                    {payment.isPaid ? '✅ Đã' : '⏳ Chưa'}
                                                                </span>
                                                            </div>
                                                            {payment.method && (
                                                                <p className="text-xs text-gray-600 font-medium">PT: {payment.method}</p>
                                                            )}
                                                            {payment.isPaid && payment.paidAt && (
                                                                <p className="text-xs text-green-600 mt-2">✓ {new Date(payment.paidAt).toLocaleDateString('vi-VN')}</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-6">
                                                    <CreditCard className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                    <p className="text-sm text-gray-500">Chưa có thanh toán</p>
                                                </div>
                                            )}
                                        </div>

                                        {selectedContract.isPayment ? (
                                            <div className="w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 bg-green-100 text-green-700 border-2 border-green-500 mt-4">
                                                <span className="text-lg">✓</span>
                                                Tháng này đã thanh toán
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handlePayment(selectedContract.uid)}
                                                disabled={paymentLoading || selectedContract.status !== 'Active'}
                                                className={cn(
                                                    'w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all mt-4',
                                                    paymentLoading
                                                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                        : selectedContract.status !== 'Active'
                                                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-primary to-primary/80 text-white hover:shadow-lg hover:scale-105'
                                                )}
                                            >
                                                <Zap className="w-5 h-5" />
                                                {paymentLoading ? 'Đang xử lý...' : 'Thanh toán ngay'}
                                            </button>
                                        )}
                                    </>
                                ) : activeTab === 'contract' ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                        <p className="text-sm">Chọn hợp đồng để xem chi tiết</p>
                                    </div>
                                ) : null}

                                {/* PAYMENT DETAILS */}
                                {activeTab === 'payment' && selectedPayment ? (
                                    <>
                                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
                                            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Số tiền</p>
                                            <p className="text-3xl font-bold text-primary">
                                                {selectedPayment.amount.toLocaleString('vi-VN')} đ
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Trạng thái</p>
                                            <span className={cn(
                                                'text-xs px-3 py-1.5 rounded-full inline-block font-semibold border',
                                                selectedPayment.isPaid
                                                    ? 'bg-green-100 text-green-700 border-green-300'
                                                    : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                            )}>
                                                {selectedPayment.isPaid ? '✅ Đã thanh toán' : '⏳ Chưa thanh toán'}
                                            </span>
                                        </div>

                                        {selectedPayment.month && selectedPayment.year && (
                                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    Kỳ thanh toán
                                                </p>
                                                <p className="text-sm font-bold text-gray-900">Tháng {selectedPayment.month}/{selectedPayment.year}</p>
                                            </div>
                                        )}

                                        {selectedPayment.isPaid && selectedPayment.paidAt && (
                                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    Ngày thanh toán
                                                </p>
                                                <p className="text-sm font-bold text-green-700">{new Date(selectedPayment.paidAt).toLocaleDateString('vi-VN')}</p>
                                            </div>
                                        )}

                                        {selectedPayment.method && (
                                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2">Phương thức</p>
                                                <p className="text-sm font-medium text-gray-900">{selectedPayment.method}</p>
                                            </div>
                                        )}

                                        {selectedPayment.note && (
                                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Ghi chú</p>
                                                <p className="text-sm text-gray-900">{selectedPayment.note}</p>
                                            </div>
                                        )}
                                    </>
                                ) : activeTab === 'payment' ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                        <p className="text-sm">Chọn thanh toán để xem chi tiết</p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </aside>

                    {/* RIGHT CONTENT AREA */}
                    <main className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">Chi Tiết</h2>
                        </div>
                        <div className="p-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
