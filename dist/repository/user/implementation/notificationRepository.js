"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notificationSchema_1 = __importDefault(require("../../../model/user/notificationSchema"));
class NotificationRepository {
    async create(notification) {
        const createdNotification = new notificationSchema_1.default(notification);
        await createdNotification.save();
        return createdNotification.toObject();
    }
    // Get notifications with optional pagination and unread filter
    async getUserNotifications(userId, options = {}) {
        const { page = 1, limit = 20, unreadOnly = false } = options;
        const skip = (page - 1) * limit;
        const filter = { userId };
        if (unreadOnly)
            filter.read = false;
        return notificationSchema_1.default.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
    }
    // Get count of unread notifications
    async getUnreadCount(userId) {
        return notificationSchema_1.default.countDocuments({ userId, read: false }).exec();
    }
    // Mark a single notification as read
    async markAsRead(notificationId, userId) {
        const notification = await notificationSchema_1.default.findOneAndUpdate({ _id: notificationId, userId }, { $set: { read: true } }, { new: true });
        return notification;
    }
    // Mark all notifications as read
    async markAllAsRead(userId) {
        const result = await notificationSchema_1.default.updateMany({ userId, read: false }, { $set: { read: true } });
        return { modifiedCount: result.modifiedCount };
    }
    // Create multiple notifications at once
    async createBulkNotifications(notifications) {
        return notificationSchema_1.default.insertMany(notifications, { ordered: true });
    }
    // Get paginated notifications with total count and unread count
    async getUserNotificationsPaginated(userId, page = 1, limit = 20, unreadOnly = false) {
        const skip = (page - 1) * limit;
        const filter = { userId };
        if (unreadOnly)
            filter.read = false;
        const [notifications, total, unreadCount] = await Promise.all([
            notificationSchema_1.default.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            notificationSchema_1.default.countDocuments(filter).exec(),
            notificationSchema_1.default.countDocuments({ userId, read: false }).exec(),
        ]);
        return { notifications, total, unreadCount, page, hasMore: skip + notifications.length < total, };
    }
    // Delete old read notifications
    async cleanupOldNotifications(daysToKeep) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        const result = await notificationSchema_1.default.deleteMany({ createdAt: { $lt: cutoffDate } });
        return { deletedCount: result.deletedCount ?? 0 };
    }
    // Get notifications by type
    async getNotificationsByType(userId, type) {
        const filter = { userId, type };
        return notificationSchema_1.default.find(filter).sort({ createdAt: -1 }).exec();
    }
    // Get notifications by priority
    async getNotificationsByPriority(userId, priority) {
        const filter = { userId, priority };
        return notificationSchema_1.default.find(filter).sort({ createdAt: -1 }).exec();
    }
}
exports.default = NotificationRepository;
//# sourceMappingURL=notificationRepository.js.map