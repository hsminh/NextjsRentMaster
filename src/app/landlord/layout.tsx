'use client'

import React, { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
    LayoutDashboard,
    Home,
    Users,
    Settings,
    Bell,
    Search,
    FileText,
    DollarSign,
    X,
    MessageSquare,
    CheckCircle,
    AlertCircle,
    Check
} from "lucide-react"
import LandlordGuard from "@/app/landlord/middleware/landlord-guard"
import LeftBar from "@/app/components/layout/LeftBar"
import { ref, onValue, off, update, onChildAdded } from 'firebase/database';
import database from '@/lib/firebase';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { initializeAuth } from "@/store/authSlice";
import Link from "next/link";
import {NotificationAPI} from "@/app/landlord/api";

type MenuItem = {
    icon: React.ElementType
    label: string
    path: string
}

type Notification = {
    id: string
    content: string
    title: string
    type: string
    sender: 'user' | 'bot' | 'system'
    isRead: boolean
    link?: string
    timestamp: string
    data?: Record<string, any>
}

const parseIsRead = (value: any): boolean => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    if (typeof value === 'number') return value === 1;
    return false;
};

export default function LandlordLayout({
                                           children,
                                       }: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(true)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isNotificationOpen, setIsNotificationOpen] = useState(false)
    const [isMarkingAll, setIsMarkingAll] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch()
    const userUid = useSelector((state: RootState) => state.auth.userUid)

    useEffect(() => {
        dispatch(initializeAuth() as any)
    }, [dispatch])

    // Calculate unread count
    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Get notification icon based on type
    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'JOIN_REQUEST':
                return Users;
            case 'MESSAGE':
                return MessageSquare;
            case 'PAYMENT':
                return DollarSign;
            case 'CONTRACT':
                return FileText;
            case 'SYSTEM':
                return AlertCircle;
            default:
                return Bell;
        }
    }

    // Format timestamp
    const formatTimeAgo = (timestamp: string) => {
        const now = new Date();
        const past = new Date(timestamp);
        const diffMs = now.getTime() - past.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays < 7) return `${diffDays} ngày trước`;

        return past.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

// Call backend API to mark all notifications as read
    const handleMarkAllAsReadAPI = async () => {
        if (!userUid || unreadCount === 0) return;

        // Store current notifications for potential rollback
        const previousNotifications = [...notifications];

        // IMMEDIATELY update local state for instant UX
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, isRead: true }))
        );

        // Also immediately update badge count
        setIsMarkingAll(true);

        try {
            // Create API instance
            const notificationApi = new NotificationAPI();

            // Call backend API with timeout
            const apiPromise = notificationApi.markAllAsRead();
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout')), 5000)
            );

            await Promise.race([apiPromise, timeoutPromise]);

            console.log('Successfully marked all notifications as read via API');

        } catch (error: any) {
            console.error('Failed to mark all notifications as read via API:', error);

            // Show error toast but don't revert (users hate UI jumping back)
            // The notification is already marked as read in UI
        }

        // Update Firebase in background (don't wait for it)
        if (database) {
            setTimeout(() => {
                try {
                    const updates: Record<string, any> = {};
                    previousNotifications.forEach(notif => {
                        if (!notif.isRead) {
                            updates[`notification-landlord-${userUid}/${notif.id}/isRead`] = true;
                        }
                    });

                    if (Object.keys(updates).length > 0) {
                        update(ref(database), updates)
                            .then(() => console.log('Firebase updated in background'))
                            .catch(err => console.error('Background Firebase update failed:', err));
                    }
                } catch (firebaseError) {
                    console.error('Background Firebase update error:', firebaseError);
                }
            }, 100); // Small delay to prioritize UI responsiveness
        }

        setIsMarkingAll(false);
    };

    useEffect(() => {
        if (!database || !userUid) return;

        const channel = `notification-landlord-${userUid}`;
        const chatRef = ref(database, channel);

        // Load existing notifications
        const loadExisting = onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loaded: Notification[] = Object.entries(data).map(([id, msg]: [string, any]) => ({
                    id,
                    content: msg.content || '',
                    title: msg.title || 'Thông báo mới',
                    type: msg.type || 'SYSTEM',
                    sender: msg.sender === 'bot' ? 'bot' : msg.sender === 'system' ? 'system' : 'user',
                    isRead: parseIsRead(msg.isRead),
                    link: msg.link,
                    timestamp: msg.timestamp || new Date().toISOString(),
                    data: msg.data
                }));

                // Sort by timestamp (newest first)
                loaded.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                setNotifications(loaded);
            } else {
                setNotifications([]);
            }
        });

        // Listen for new notifications
        const newMessageListener = onChildAdded(chatRef, (snapshot) => {
            const msg = snapshot.val();
            if (!msg) return;

            const newNotif: Notification = {
                id: snapshot.key || Date.now().toString(),
                content: msg.content || '',
                title: msg.title || 'Thông báo mới',
                type: msg.type || 'SYSTEM',
                sender: msg.sender === 'bot' ? 'bot' : msg.sender === 'system' ? 'system' : 'user',
                isRead: parseIsRead(msg.isRead),
                link: msg.link,
                timestamp: msg.timestamp || new Date().toISOString(),
                data: msg.data
            };

            // Add to beginning of array
            setNotifications(prev => [newNotif, ...prev]);

            // Show browser notification if not focused
            if (!document.hasFocus() && Notification.permission === 'granted' && !newNotif.isRead) {
                new Notification(newNotif.title, {
                    body: newNotif.content,
                    icon: '/logo.svg',
                });
            }
        });

        // Request notification permission
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        return () => {
            off(chatRef, 'value', loadExisting);
            off(chatRef, 'child_added', newMessageListener);
        };
    }, [userUid]);

    // Mark single notification as read
    const handleNotificationClick = async (notification: Notification) => {
        if (!userUid || !notification.id) return;

        // Update local state immediately for better UX
        setNotifications(prev =>
            prev.map(n =>
                n.id === notification.id ? { ...n, isRead: true } : n
            )
        );

        // Update in Firebase
        try {
            const notificationRef = ref(database, `notification-landlord-${userUid}/${notification.id}`);
            await update(notificationRef, { isRead: true });
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            // Revert on error
            setNotifications(prev =>
                prev.map(n =>
                    n.id === notification.id ? { ...n, isRead: notification.isRead } : n
                )
            );
        }

        // Navigate if there's a link
        if (notification.link) {
            window.open(notification.link, '_blank');
        }

        // Close notification panel if on mobile
        if (window.innerWidth < 768) {
            setIsNotificationOpen(false);
        }
    };

    const handleLogout = () => {
        window.location.href = '/landlord/passport/login';
    };

    // Scroll to bottom when notifications change
    useEffect(() => {
        if (isNotificationOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [notifications, isNotificationOpen]);

    if (pathname.startsWith("/landlord/passport")) {
        return <>{children}</>;
    }

    return (
        <LandlordGuard>
            <div className="flex flex-col h-screen bg-gray-50 text-gray-800">
                {/* HEADER */}
                <header className="w-full bg-white border-b shadow-sm z-30 sticky top-0">
                    <div className="h-16 relative flex items-center justify-between px-4 md:px-6">
                        {/* LOGO */}
                        <div className="flex items-center space-x-3">
                            <Link href="/landlord/dashboard">
                                <Image
                                    src="/logo.svg"
                                    alt="RentMaster Logo"
                                    width={120}
                                    height={40}
                                    priority
                                    className="h-10 w-auto"
                                />
                            </Link>
                        </div>

                        {/* SEARCH BAR - Hidden on mobile */}
                        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
                            <div className="relative w-full">
                                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                                    <Search size={18} />
                                </span>
                                <input
                                    type="search"
                                    placeholder="Tìm kiếm căn hộ, người thuê, hợp đồng..."
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* RIGHT SECTION */}
                        <div className="flex items-center space-x-2 md:space-x-4">
                            {/* Search button for mobile */}
                            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
                                <Search size={20} />
                            </button>

                            {/* NOTIFICATION BUTTON */}
                            <div className="relative">
                                <button
                                    aria-label="Notifications"
                                    className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                >
                                    <Bell size={22} className="text-gray-600" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* NOTIFICATION DROPDOWN */}
                                {isNotificationOpen && (
                                    <>
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setIsNotificationOpen(false)}
                                        />

                                        {/* Dropdown */}
                                        <div className="absolute right-0 top-full mt-2 w-[90vw] sm:w-96 bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden z-50 max-h-[80vh]">
                                            {/* Header */}
                                            <div className="flex justify-between items-center px-4 py-3 border-b bg-gradient-to-r from-indigo-50 to-white">
                                                <div>
                                                    <span className="font-semibold text-gray-800">Thông báo</span>
                                                    {unreadCount > 0 && (
                                                        <span className="ml-2 text-sm text-gray-500">
                                                            ({unreadCount} chưa đọc)
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {unreadCount > 0 && (
                                                        <button
                                                            onClick={handleMarkAllAsReadAPI}
                                                            disabled={isMarkingAll}
                                                            className="text-sm text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                                        >
                                                            {isMarkingAll ? (
                                                                <>
                                                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600"></div>
                                                                    Đang xử lý...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Check size={14} />
                                                                    Đọc tất cả
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setIsNotificationOpen(false)}
                                                        className="p-1 rounded-full hover:bg-gray-100"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Notification List */}
                                            <div className="overflow-y-auto max-h-[60vh]">
                                                {notifications.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center py-12 px-4">
                                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                                            <Bell size={24} className="text-gray-400" />
                                                        </div>
                                                        <p className="text-gray-500 text-center">
                                                            Chưa có thông báo nào
                                                        </p>
                                                        <p className="text-sm text-gray-400 mt-1 text-center">
                                                            Các thông báo mới sẽ xuất hiện ở đây
                                                        </p>
                                                    </div>
                                                ) : (
                                                    notifications.map((notification) => {
                                                        const Icon = getNotificationIcon(notification.type);
                                                        const isUnread = !notification.isRead;

                                                        return (
                                                            <div
                                                                key={notification.id}
                                                                className={`p-4 cursor-pointer transition-all border-b border-gray-50 last:border-b-0 ${
                                                                    isUnread
                                                                        ? 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500'
                                                                        : 'hover:bg-gray-50'
                                                                }`}
                                                                onClick={() => handleNotificationClick(notification)}
                                                            >
                                                                <div className="flex items-start space-x-3">
                                                                    <div className={`p-2 rounded-lg ${
                                                                        isUnread ? 'bg-blue-100' : 'bg-gray-100'
                                                                    }`}>
                                                                        <Icon size={20} className={
                                                                            isUnread ? 'text-blue-600' : 'text-gray-600'
                                                                        } />
                                                                    </div>

                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex justify-between items-start">
                                                                            <h4 className={`font-medium truncate ${
                                                                                isUnread ? 'text-gray-900' : 'text-gray-700'
                                                                            }`}>
                                                                                {notification.title}
                                                                            </h4>
                                                                            <div className="flex items-center space-x-1">
                                                                                {isUnread && (
                                                                                    <span className="inline-flex h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                                                                                )}
                                                                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                                                                    {formatTimeAgo(notification.timestamp)}
                                                                                </span>
                                                                            </div>
                                                                        </div>

                                                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                                            {notification.content}
                                                                        </p>

                                                                        {notification.type === 'JOIN_REQUEST' && notification.data?.apartmentId && (
                                                                            <div className="mt-2 text-xs text-gray-500">
                                                                                ID căn hộ: {notification.data.apartmentId}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                )}
                                                <div ref={messagesEndRef} />
                                            </div>

                                            {/* Footer */}
                                            <div className="px-4 py-3 border-t bg-gray-50 flex justify-between items-center">
                                                <Link
                                                    href="/landlord/notifications"
                                                    className="text-sm text-indigo-600 hover:text-indigo-800"
                                                    onClick={() => setIsNotificationOpen(false)}
                                                >
                                                    Xem tất cả thông báo →
                                                </Link>
                                                <div className="text-xs text-gray-400">
                                                    {notifications.length} thông báo
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* USER AVATAR */}
                            <div className="flex items-center space-x-3">
                                <button className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                        CN
                                    </div>
                                    <span className="hidden md:inline text-sm font-medium text-gray-700">
                                        Chủ nhà
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* MAIN CONTENT */}
                <div className="flex flex-1 overflow-hidden">
                    <LeftBar
                        isOpen={isOpen}
                        toggleSidebar={() => setIsOpen(!isOpen)}
                        menuItems={[
                            { icon: LayoutDashboard, label: "Tổng quan", path: "/landlord/dashboard" },
                            { icon: Home, label: "Căn hộ / Toà nhà", path: "/landlord/apartments" },
                            { icon: Home, label: "Phòng cho thuê", path: "/landlord/rooms" },
                            { icon: Users, label: "Người thuê", path: "/landlord/tenants" },
                            { icon: FileText, label: "Hợp đồng", path: "/landlord/contracts" },
                            { icon: DollarSign, label: "Tài chính", path: "/landlord/finance" },
                            { icon: MessageSquare, label: "Tin nhắn", path: "/landlord/messages" },
                            { icon: Bell, label: "Thông báo", path: "/landlord/notifications" },
                            { icon: Settings, label: "Cài đặt", path: "/landlord/settings" },
                        ]}
                        onLogout={handleLogout}
                        title="Bảng điều khiển chủ nhà"
                    />

                    {/* PAGE CONTENT */}
                    <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </LandlordGuard>
    );
}