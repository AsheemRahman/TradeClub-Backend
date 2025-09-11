
import mongoose from "mongoose";
import { INotification } from "../../model/user/notificationSchema";

interface NotificationOptions {
    type?: string;
    actionUrl?: string | null;
    priority?: 'low' | 'medium' | 'high';
    metadata?: Record<string, any>;
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
}

interface PaginatedNotifications {
    notifications: INotification[];
    total: number;
    unreadCount: number;
    page: number;
    hasMore: boolean;
}


interface INotificationService {
    getUserNotifications(userId: string | mongoose.Types.ObjectId, options: NotificationOptions): Promise<PaginatedNotifications>
    createNotification(userId: string | mongoose.Types.ObjectId, title: string, message: string, options: NotificationOptions): Promise<INotification>
    createBulkNotifications(userIds: (string | mongoose.Types.ObjectId)[], title: string, message: string, options: NotificationOptions): Promise<INotification[]>
    markAsRead(notificationId: string | mongoose.Types.ObjectId, userId: string | mongoose.Types.ObjectId): Promise<INotification>
    markAllAsRead(userId: string | mongoose.Types.ObjectId): Promise<{ modifiedCount: number }>
notifyNewCourseEnrollment(userId: string | mongoose.Types.ObjectId, courseName: string): Promise<INotification>
notifyConsultationScheduled(userId: string | mongoose.Types.ObjectId, consultationDate: string, consultationId: string | mongoose.Types.ObjectId): Promise<INotification>
notifySubscriptionExpiring(userId: string | mongoose.Types.ObjectId, expiryDate: string): Promise<INotification>


    notifyNewCourseAvailable(courseName: string, courseId: string | mongoose.Types.ObjectId): Promise<INotification[]>
    cleanupOldNotifications(daysToKeep: number): Promise<number>
}

export default INotificationService;