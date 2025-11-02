// services/NotificationService.ts
import mongoose from "mongoose";
import { INotification } from "../../../model/user/notificationSchema";
import INotificationRepository from "../../../repository/user/INotificationRepository";
import IUserRepository from "../../../repository/user/IUserRepository";

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


class NotificationService {
    private _notificationRepository: INotificationRepository;
    private _userRepository: IUserRepository;

    constructor(notificationRepository: INotificationRepository, userRepository: IUserRepository) {
        this._notificationRepository = notificationRepository;
        this._userRepository = userRepository;
    }

    async getUserNotifications(userId: string | mongoose.Types.ObjectId, options: NotificationOptions = {}): Promise<PaginatedNotifications> {
        return await this._notificationRepository.getUserNotificationsPaginated(
            userId,
            options.page ?? 1,
            options.limit ?? 10,
            options.unreadOnly ?? false
        );
    }

    async createNotification(userId: string | mongoose.Types.ObjectId, title: string, message: string, options: NotificationOptions = {}): Promise<INotification> {
        const notificationData = {
            userId,
            title,
            message,
            type: options.type || 'system',
            actionUrl: options.actionUrl || null,
            priority: options.priority || 'medium',
            metadata: options.metadata || {}
        };
        const notification = await this._notificationRepository.create(notificationData as INotification);
        await this.broadcastToUser(userId, notification);
        return notification;
    }

    async createBulkNotifications(userIds: (string | mongoose.Types.ObjectId)[], title: string, message: string, options: NotificationOptions = {}): Promise<INotification[]> {
        const notifications = userIds.map(userId => ({
            userId,
            title,
            message,
            type: options.type || 'system',
            actionUrl: options.actionUrl || null,
            priority: options.priority || 'medium',
            metadata: options.metadata || {}
        }));
        const createdNotifications = await this._notificationRepository.createBulkNotifications(notifications as any);
        await Promise.all(
            createdNotifications.map(notification =>
                this.broadcastToUser(notification.userId, notification)
            )
        );
        return createdNotifications;
    }

    async markAsRead(notificationId: string | mongoose.Types.ObjectId, userId: string | mongoose.Types.ObjectId): Promise<INotification> {
        const notification = await this._notificationRepository.markAsRead(notificationId as string, userId as string);
        if (!notification) {
            throw new Error('Notification not found or access denied');
        }
        return notification;
    }

    async markAllAsRead(userId: string | mongoose.Types.ObjectId): Promise<{ modifiedCount: number }> {
        return await this._notificationRepository.markAllAsRead(userId);
    }

    // Notification templates
    async notifyNewCourseEnrollment(userId: string | mongoose.Types.ObjectId, courseName: string): Promise<INotification> {
        return await this.createNotification(
            userId,
            'Course Enrollment Successful!',
            `You have successfully enrolled in "${courseName}". Start learning now!`,
            {
                type: 'course',
                actionUrl: '/my-learning',
                priority: 'medium',
                metadata: { courseName }
            }
        );
    }

    async notifyConsultationScheduled(userId: string | mongoose.Types.ObjectId, consultationDate: string, consultationId: string | mongoose.Types.ObjectId): Promise<INotification> {
        const formattedDate = new Date(consultationDate).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        return await this.createNotification(
            userId,
            'Consultation Scheduled',
            `Your consultation has been scheduled for ${formattedDate}. Please be on time.`,
            {
                type: 'consultation',
                actionUrl: `/consultation/${consultationId}`,
                priority: 'high',
                metadata: { consultationDate, consultationId }
            }
        );
    }

    async notifySubscriptionExpiring(userId: string | mongoose.Types.ObjectId, expiryDate: string): Promise<INotification> {
        return await this.createNotification(
            userId,
            'Subscription Expiring Soon',
            `Your subscription will expire on ${expiryDate}. Renew now to continue enjoying our services.`,
            {
                type: 'subscription',
                actionUrl: '/subscription',
                priority: 'high',
                metadata: { expiryDate }
            }
        );
    }

    async notifyNewCourseAvailable(courseName: string, courseId: string | mongoose.Types.ObjectId): Promise<INotification[]> {
        const activeUsers = await this._userRepository.findManyUser();
        const userIds = activeUsers.map(user => user._id);
        return await this.createBulkNotifications(
            userIds as (string | mongoose.Types.ObjectId)[],
            'New Course Available!',
            `Check out our new course: "${courseName}". Enroll now and start learning!`,
            {
                type: 'course',
                actionUrl: `/courses/${courseId}`,
                priority: 'medium',
                metadata: { courseName, courseId }
            }
        );
    }

    private async broadcastToUser(userId: string | mongoose.Types.ObjectId, notification: INotification): Promise<void> {
        const io = require('../../../config/socketConfig').getIO();
        if (io) {
            io.to(`user_${userId}`).emit('notification', {
                id: notification._id,
                title: notification.title,
                message: notification.message,
                type: notification.type,
                priority: notification.priority,
                createdAt: notification.createdAt
            });
        }
    }

    async cleanupOldNotifications(daysToKeep = 30): Promise<number> {
        const result = await this._notificationRepository.cleanupOldNotifications(daysToKeep);
        console.error(`Cleaned up ${result.deletedCount} old notifications`);
        return result.deletedCount;
    }
}

export default NotificationService;
