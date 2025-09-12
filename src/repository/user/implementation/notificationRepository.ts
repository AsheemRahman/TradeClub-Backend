import mongoose, { FilterQuery } from 'mongoose';
import Notification, { INotification } from '../../../model/user/notificationSchema';
import INotificationRepository from '../INotificationRepository';


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

class NotificationRepository implements INotificationRepository  {

    async create(notification: NotificationCreateInput): Promise<INotification> {
        const createdNotification = new Notification(notification);
        await createdNotification.save();
        return createdNotification.toObject() as INotification;
    }

    // Get notifications with optional pagination and unread filter
    async getUserNotifications(userId: string | mongoose.Types.ObjectId, options: PaginationOptions = {}): Promise<INotification[]> {
        const { page = 1, limit = 20, unreadOnly = false } = options;
        const skip = (page - 1) * limit;
        const filter: FilterQuery<INotification> = { userId };
        if (unreadOnly) filter.read = false;
        return Notification.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
    }

    // Get count of unread notifications
    async getUnreadCount(userId: string | mongoose.Types.ObjectId): Promise<number> {
        return Notification.countDocuments({ userId, read: false }).exec();
    }

    // Mark a single notification as read
    async markAsRead(notificationId: string, userId: string): Promise<INotification | null> {
        const notification = await Notification.findOneAndUpdate({ _id: notificationId, userId }, { $set: { read: true } }, { new: true });
        return notification;
    }

    // Mark all notifications as read
    async markAllAsRead(userId: string | mongoose.Types.ObjectId): Promise<{ modifiedCount: number }> {
        const result = await Notification.updateMany({ userId, read: false }, { $set: { read: true } });
        return { modifiedCount: result.modifiedCount };
    }

    // Create multiple notifications at once
    async createBulkNotifications(notifications: Omit<INotification, '_id' | 'createdAt' | 'updatedAt'>[]): Promise<INotification[]> {
        return Notification.insertMany(notifications, { ordered: true }) as Promise<INotification[]>;
    }

    // Get paginated notifications with total count and unread count
    async getUserNotificationsPaginated(userId: string | mongoose.Types.ObjectId, page: number = 1, limit: number = 20, unreadOnly: boolean = false): Promise<{
        notifications: INotification[];
        total: number;
        unreadCount: number;
        page: number;
        hasMore: boolean;
    }> {
        const skip = (page - 1) * limit;
        const filter: FilterQuery<INotification> = { userId };
        if (unreadOnly) filter.read = false;
        const [notifications, total, unreadCount] = await Promise.all([
            Notification.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            Notification.countDocuments(filter).exec(),
            Notification.countDocuments({ userId, read: false }).exec(),
        ]);
        return { notifications, total, unreadCount, page, hasMore: skip + notifications.length < total, };
    }

    // Delete old read notifications
    async cleanupOldNotifications(daysToKeep: number): Promise<{ deletedCount: number }> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        const result = await Notification.deleteMany({ createdAt: { $lt: cutoffDate } });
        return { deletedCount: result.deletedCount ?? 0 };
    }

    // Get notifications by type
    async getNotificationsByType(userId: string | mongoose.Types.ObjectId, type: INotification['type']): Promise<INotification[]> {
        const filter: FilterQuery<INotification> = { userId, type };
        return Notification.find(filter).sort({ createdAt: -1 }).exec();
    }

    // Get notifications by priority
    async getNotificationsByPriority(userId: string | mongoose.Types.ObjectId, priority: INotification['priority']): Promise<INotification[]> {
        const filter: FilterQuery<INotification> = { userId, priority };
        return Notification.find(filter).sort({ createdAt: -1 }).exec();
    }
}

export default NotificationRepository;
