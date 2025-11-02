"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class NotificationService {
    constructor(notificationRepository, userRepository) {
        this._notificationRepository = notificationRepository;
        this._userRepository = userRepository;
    }
    getUserNotifications(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, options = {}) {
            var _a, _b, _c;
            return yield this._notificationRepository.getUserNotificationsPaginated(userId, (_a = options.page) !== null && _a !== void 0 ? _a : 1, (_b = options.limit) !== null && _b !== void 0 ? _b : 10, (_c = options.unreadOnly) !== null && _c !== void 0 ? _c : false);
        });
    }
    createNotification(userId_1, title_1, message_1) {
        return __awaiter(this, arguments, void 0, function* (userId, title, message, options = {}) {
            const notificationData = {
                userId,
                title,
                message,
                type: options.type || 'system',
                actionUrl: options.actionUrl || null,
                priority: options.priority || 'medium',
                metadata: options.metadata || {}
            };
            const notification = yield this._notificationRepository.create(notificationData);
            yield this.broadcastToUser(userId, notification);
            return notification;
        });
    }
    createBulkNotifications(userIds_1, title_1, message_1) {
        return __awaiter(this, arguments, void 0, function* (userIds, title, message, options = {}) {
            const notifications = userIds.map(userId => ({
                userId,
                title,
                message,
                type: options.type || 'system',
                actionUrl: options.actionUrl || null,
                priority: options.priority || 'medium',
                metadata: options.metadata || {}
            }));
            const createdNotifications = yield this._notificationRepository.createBulkNotifications(notifications);
            yield Promise.all(createdNotifications.map(notification => this.broadcastToUser(notification.userId, notification)));
            return createdNotifications;
        });
    }
    markAsRead(notificationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield this._notificationRepository.markAsRead(notificationId, userId);
            if (!notification) {
                throw new Error('Notification not found or access denied');
            }
            return notification;
        });
    }
    markAllAsRead(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._notificationRepository.markAllAsRead(userId);
        });
    }
    // Notification templates
    notifyNewCourseEnrollment(userId, courseName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.createNotification(userId, 'Course Enrollment Successful!', `You have successfully enrolled in "${courseName}". Start learning now!`, {
                type: 'course',
                actionUrl: '/my-learning',
                priority: 'medium',
                metadata: { courseName }
            });
        });
    }
    notifyConsultationScheduled(userId, consultationDate, consultationId) {
        return __awaiter(this, void 0, void 0, function* () {
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
            return yield this.createNotification(userId, 'Consultation Scheduled', `Your consultation has been scheduled for ${formattedDate}. Please be on time.`, {
                type: 'consultation',
                actionUrl: `/consultation/${consultationId}`,
                priority: 'high',
                metadata: { consultationDate, consultationId }
            });
        });
    }
    notifySubscriptionExpiring(userId, expiryDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.createNotification(userId, 'Subscription Expiring Soon', `Your subscription will expire on ${expiryDate}. Renew now to continue enjoying our services.`, {
                type: 'subscription',
                actionUrl: '/subscription',
                priority: 'high',
                metadata: { expiryDate }
            });
        });
    }
    notifyNewCourseAvailable(courseName, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const activeUsers = yield this._userRepository.findManyUser();
            const userIds = activeUsers.map(user => user._id);
            return yield this.createBulkNotifications(userIds, 'New Course Available!', `Check out our new course: "${courseName}". Enroll now and start learning!`, {
                type: 'course',
                actionUrl: `/courses/${courseId}`,
                priority: 'medium',
                metadata: { courseName, courseId }
            });
        });
    }
    broadcastToUser(userId, notification) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    cleanupOldNotifications() {
        return __awaiter(this, arguments, void 0, function* (daysToKeep = 30) {
            const result = yield this._notificationRepository.cleanupOldNotifications(daysToKeep);
            console.error(`Cleaned up ${result.deletedCount} old notifications`);
            return result.deletedCount;
        });
    }
}
exports.default = NotificationService;
