import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, X, AlertTriangle, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    type Notification,
} from '@/services/notification.service';
import { useNavigate } from 'react-router-dom';

// Helper function to format time ago
const formatTimeAgo = (date: string): string => {
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    return past.toLocaleDateString();
};

export function NotificationDropdown() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch notifications when dropdown opens
    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    // Fetch initial unread count on mount
    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const data = await getNotifications();
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await markAsRead(notificationId);
            setNotifications((prev) =>
                prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleDelete = async (notificationId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await deleteNotification(notificationId);
            const notification = notifications.find((n) => n.id === notificationId);
            setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
            if (notification && !notification.isRead) {
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        // Mark as read if not already
        if (!notification.isRead) {
            try {
                await markAsRead(notification.id);
                setNotifications((prev) =>
                    prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            } catch (error) {
                console.error('Failed to mark notification as read:', error);
            }
        }

        // Navigate if there's an action URL
        if (notification.actionUrl) {
            setIsOpen(false);
            navigate(notification.actionUrl);
        }
    };

    const getNotificationIcon = (type: Notification['type'], severity?: string) => {
        const iconClass = 'h-5 w-5';

        switch (type) {
            case 'OUTBREAK':
            case 'ALERT':
                return <AlertTriangle className={`${iconClass} text-red-500`} />;
            case 'WARNING':
                return <AlertCircle className={`${iconClass} text-orange-500`} />;
            case 'SUCCESS':
                return <CheckCircle className={`${iconClass} text-green-500`} />;
            case 'INFO':
            case 'SYSTEM':
            default:
                return <Info className={`${iconClass} text-blue-500`} />;
        }
    };

    const getSeverityColor = (severity?: string) => {
        switch (severity) {
            case 'high':
                return 'border-l-red-500 bg-red-50/50';
            case 'medium':
                return 'border-l-orange-500 bg-orange-50/50';
            case 'low':
                return 'border-l-blue-500 bg-blue-50/50';
            default:
                return 'border-l-gray-300 bg-gray-50/50';
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-96 p-0" align="end">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <h3 className="font-semibold text-foreground">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="h-auto p-1 text-xs text-primary hover:text-primary/80"
                        >
                            <Check className="mr-1 h-3 w-3" />
                            Mark all read
                        </Button>
                    )}
                </div>

                {/* Notifications List */}
                <ScrollArea className="h-[400px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Bell className="mb-3 h-12 w-12 text-muted-foreground/30" />
                            <p className="text-sm text-muted-foreground">No notifications yet</p>
                            <p className="mt-1 text-xs text-muted-foreground/70">
                                We'll notify you when something important happens
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`group relative cursor-pointer border-l-4 px-4 py-3 transition-colors hover:bg-accent ${!notification.isRead ? 'bg-primary/5' : ''
                                        } ${getSeverityColor(notification.severity)}`}
                                >
                                    <div className="flex gap-3">
                                        {/* Icon */}
                                        <div className="flex-shrink-0 pt-0.5">
                                            {getNotificationIcon(notification.type, notification.severity)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4
                                                    className={`text-sm font-medium leading-tight ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                                                        }`}
                                                >
                                                    {notification.title}
                                                </h4>
                                                {!notification.isRead && (
                                                    <div className="h-2 w-2 flex-shrink-0 rounded-full bg-primary"></div>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground/60">
                                                {formatTimeAgo(notification.createdAt)}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                            {!notification.isRead && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={(e) => handleMarkAsRead(notification.id, e)}
                                                    title="Mark as read"
                                                >
                                                    <Check className="h-3.5 w-3.5" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-destructive hover:text-destructive"
                                                onClick={(e) => handleDelete(notification.id, e)}
                                                title="Delete"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="border-t px-4 py-2 text-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setIsOpen(false);
                                navigate('/notifications');
                            }}
                            className="text-xs text-primary hover:text-primary/80"
                        >
                            View all notifications
                        </Button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
