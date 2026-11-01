"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotificationService {
    _notificationRepository;
    _userRepository;
    constructor(notificationRepository, userRepository) {
        this._notificationRepository = notificationRepository;
        this._userRepository = userRepository;
    }
    async getUserNotifications(userId, options = {}) {
        return await this._notificationRepository.getUserNotificationsPaginated(userId, options.page ?? 1, options.limit ?? 10, options.unreadOnly ?? false);
    }
    async createNotification(userId, title, message, options = {}) {
        const notificationData = {
            userId,
            title,
            message,
            type: options.type || 'system',
            actionUrl: options.actionUrl || null,
            priority: options.priority || 'medium',
            metadata: options.metadata || {}
        };
        const notification = await this._notificationRepository.create(notificationData);
        await this.broadcastToUser(userId, notification);
        return notification;
    }
    async createBulkNotifications(userIds, title, message, options = {}) {
        const notifications = userIds.map(userId => ({
            userId,
            title,
            message,
            type: options.type || 'system',
            actionUrl: options.actionUrl || null,
            priority: options.priority || 'medium',
            metadata: options.metadata || {}
        }));
        const createdNotifications = await this._notificationRepository.createBulkNotifications(notifications);
        await Promise.all(createdNotifications.map(notification => this.broadcastToUser(notification.userId, notification)));
        return createdNotifications;
    }
    async markAsRead(notificationId, userId) {
        const notification = await this._notificationRepository.markAsRead(notificationId, userId);
        if (!notification) {
            throw new Error('Notification not found or access denied');
        }
        return notification;
    }
    async markAllAsRead(userId) {
        return await this._notificationRepository.markAllAsRead(userId);
    }
    // Notification templates
    async notifyNewCourseEnrollment(userId, courseName) {
        return await this.createNotification(userId, 'Course Enrollment Successful!', `You have successfully enrolled in "${courseName}". Start learning now!`, {
            type: 'course',
            actionUrl: '/my-learning',
            priority: 'medium',
            metadata: { courseName }
        });
    }
    async notifyConsultationScheduled(userId, consultationDate, consultationId) {
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
        return await this.createNotification(userId, 'Consultation Scheduled', `Your consultation has been scheduled for ${formattedDate}. Please be on time.`, {
            type: 'consultation',
            actionUrl: `/consultation/${consultationId}`,
            priority: 'high',
            metadata: { consultationDate, consultationId }
        });
    }
    async notifySubscriptionExpiring(userId, expiryDate) {
        return await this.createNotification(userId, 'Subscription Expiring Soon', `Your subscription will expire on ${expiryDate}. Renew now to continue enjoying our services.`, {
            type: 'subscription',
            actionUrl: '/subscription',
            priority: 'high',
            metadata: { expiryDate }
        });
    }
    async notifyNewCourseAvailable(courseName, courseId) {
        const activeUsers = await this._userRepository.findManyUser();
        const userIds = activeUsers.map(user => user._id);
        return await this.createBulkNotifications(userIds, 'New Course Available!', `Check out our new course: "${courseName}". Enroll now and start learning!`, {
            type: 'course',
            actionUrl: `/courses/${courseId}`,
            priority: 'medium',
            metadata: { courseName, courseId }
        });
    }
    async broadcastToUser(userId, notification) {
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
    async cleanupOldNotifications(daysToKeep = 30) {
        const result = await this._notificationRepository.cleanupOldNotifications(daysToKeep);
        console.error(`Cleaned up ${result.deletedCount} old notifications`);
        return result.deletedCount;
    }
}
exports.default = NotificationService;
//# sourceMappingURL=notificationService.js.map