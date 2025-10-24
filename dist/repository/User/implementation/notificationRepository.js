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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notificationSchema_1 = __importDefault(require("../../../model/user/notificationSchema"));
class NotificationRepository {
    create(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdNotification = new notificationSchema_1.default(notification);
            yield createdNotification.save();
            return createdNotification.toObject();
        });
    }
    // Get notifications with optional pagination and unread filter
    getUserNotifications(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, options = {}) {
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
        });
    }
    // Get count of unread notifications
    getUnreadCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return notificationSchema_1.default.countDocuments({ userId, read: false }).exec();
        });
    }
    // Mark a single notification as read
    markAsRead(notificationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield notificationSchema_1.default.findOneAndUpdate({ _id: notificationId, userId }, { $set: { read: true } }, { new: true });
            return notification;
        });
    }
    // Mark all notifications as read
    markAllAsRead(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield notificationSchema_1.default.updateMany({ userId, read: false }, { $set: { read: true } });
            return { modifiedCount: result.modifiedCount };
        });
    }
    // Create multiple notifications at once
    createBulkNotifications(notifications) {
        return __awaiter(this, void 0, void 0, function* () {
            return notificationSchema_1.default.insertMany(notifications, { ordered: true });
        });
    }
    // Get paginated notifications with total count and unread count
    getUserNotificationsPaginated(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, page = 1, limit = 20, unreadOnly = false) {
            const skip = (page - 1) * limit;
            const filter = { userId };
            if (unreadOnly)
                filter.read = false;
            const [notifications, total, unreadCount] = yield Promise.all([
                notificationSchema_1.default.find(filter)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                notificationSchema_1.default.countDocuments(filter).exec(),
                notificationSchema_1.default.countDocuments({ userId, read: false }).exec(),
            ]);
            return { notifications, total, unreadCount, page, hasMore: skip + notifications.length < total, };
        });
    }
    // Delete old read notifications
    cleanupOldNotifications(daysToKeep) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
            const result = yield notificationSchema_1.default.deleteMany({ createdAt: { $lt: cutoffDate } });
            return { deletedCount: (_a = result.deletedCount) !== null && _a !== void 0 ? _a : 0 };
        });
    }
    // Get notifications by type
    getNotificationsByType(userId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { userId, type };
            return notificationSchema_1.default.find(filter).sort({ createdAt: -1 }).exec();
        });
    }
    // Get notifications by priority
    getNotificationsByPriority(userId, priority) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { userId, priority };
            return notificationSchema_1.default.find(filter).sort({ createdAt: -1 }).exec();
        });
    }
}
exports.default = NotificationRepository;
