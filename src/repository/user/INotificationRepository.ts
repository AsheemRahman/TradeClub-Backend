
import mongoose from "mongoose";
import { INotification } from "../../model/user/notificationSchema";

interface PaginationOptions {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
}

type NotificationCreateInput = {
    userId: string | mongoose.Types.ObjectId;
    title: string;
    message: string;
    type?: string;
    actionUrl?: string | null;
    priority?: 'low' | 'medium' | 'high';
    metadata?: Record<string, any>;
    read?: boolean;
};

interface INotificationRepository {
    create(notification: NotificationCreateInput): Promise<INotification>;
    getUserNotifications(userId: string | mongoose.Types.ObjectId, options: PaginationOptions): Promise<INotification[]>;
    getUnreadCount(userId: string | mongoose.Types.ObjectId): Promise<number>
    markAsRead(notificationId: string, userId: string): Promise<INotification | null>
    markAllAsRead(userId: string | mongoose.Types.ObjectId): Promise<{ modifiedCount: number }>
    createBulkNotifications(notifications: Omit<INotification, '_id' | 'createdAt' | 'updatedAt'>[]): Promise<INotification[]>
    getUserNotificationsPaginated(userId: string | mongoose.Types.ObjectId, page: number, limit: number, unreadOnly: boolean): Promise<{
        notifications: INotification[];
        total: number;
        unreadCount: number;
        page: number;
        hasMore: boolean;
    }>
    cleanupOldNotifications(daysToKeep: number): Promise<{ deletedCount: number }>
    getNotificationsByType(userId: string | mongoose.Types.ObjectId, type: INotification['type']): Promise<INotification[]>
    getNotificationsByPriority(userId: string | mongoose.Types.ObjectId, priority: INotification['priority']): Promise<INotification[]>
}


export default INotificationRepository;