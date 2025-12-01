import AbstractRestApiClient from "@/app/utils/api/base-api-client";

export class NotificationAPI extends AbstractRestApiClient {
    protected protectedResource = true;

    /**
     * Mark all notifications as read for the current landlord
     */
    public async markAllAsRead(): Promise<void> {
        return this.post('admin/api/notifications/mark-all-read');
    }

    /**
     * Get notifications for the current landlord
     */
    public async getNotifications(): Promise<any> {
        return this.get('admin/api/notifications');
    }

    /**
     * Mark a specific notification as read
     * @param notificationId ID of the notification to mark as read
     */
    public async markAsRead(notificationId: string): Promise<void> {
        return this.patch(`admin/api/notifications/${notificationId}/read`);
    }
}