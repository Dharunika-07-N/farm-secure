import api from '@/lib/api';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'INFO' | 'WARNING' | 'ALERT' | 'OUTBREAK' | 'SYSTEM' | 'SUCCESS';
    severity?: 'high' | 'medium' | 'low';
    isRead: boolean;
    actionUrl?: string;
    metadata?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface NotificationsResponse {
    notifications: Notification[];
    unreadCount: number;
}

/**
 * Get all notifications for the current user
 */
export const getNotifications = async (): Promise<NotificationsResponse> => {
    const response = await api.get<NotificationsResponse>('/notifications');
    return response.data;
};

/**
 * Get count of unread notifications
 */
export const getUnreadCount = async (): Promise<number> => {
    const response = await api.get<{ unreadCount: number }>('/notifications/unread-count');
    return response.data.unreadCount;
};

/**
 * Mark a notification as read
 */
export const markAsRead = async (notificationId: string): Promise<Notification> => {
    const response = await api.patch<Notification>(`/notifications/${notificationId}/read`);
    return response.data;
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (): Promise<void> => {
    await api.patch('/notifications/mark-all-read');
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
    await api.delete(`/notifications/${notificationId}`);
};

/**
 * Delete all notifications
 */
export const deleteAllNotifications = async (): Promise<void> => {
    await api.delete('/notifications');
};

/**
 * Create a sample notification (for testing)
 */
export const createSampleNotification = async (type: Notification['type'] = 'INFO'): Promise<void> => {
    // This would typically be done by the backend
    // For now, we'll just use the existing notifications
    console.log('Sample notification creation requested:', type);
};
