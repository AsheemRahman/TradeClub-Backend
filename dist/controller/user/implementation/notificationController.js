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
const statusCode_1 = require("../../../constants/statusCode");
const errorMessage_1 = require("../../../constants/errorMessage");
const asyncHandler_1 = require("../../../utils/asyncHandler");
class NotificationController {
    constructor(notificationService) {
        this.getNotifications = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            if (!userId) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.UNAUTHORIZED });
                return;
            }
            const { page = 1, limit = 20, unreadOnly = false } = req.query;
            const result = yield this._notificationService.getUserNotifications(userId, {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                unreadOnly: unreadOnly === "true"
            });
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, data: result });
        }));
        this.createNotification = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userIds, title, message, type, actionUrl, priority, metadata } = req.body;
            let result;
            if (Array.isArray(userIds) && userIds.length > 1) {
                // Bulk notification
                result = yield this._notificationService.createBulkNotifications(userIds, title, message, { type, actionUrl, priority, metadata });
            }
            else {
                // Single notification
                const userId = Array.isArray(userIds) ? userIds[0] : userIds;
                result = yield this._notificationService.createNotification(userId, title, message, { type, actionUrl, priority, metadata });
            }
            res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, data: result, message: 'Notification(s) created successfully' });
        }));
        this.markAsRead = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const userId = req.userId;
            if (!userId) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: "user not found", });
                return;
            }
            const notification = yield this._notificationService.markAsRead(id, userId);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, data: notification, message: 'Notification marked as read' });
        }));
        this.markAllAsRead = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            if (!userId) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: "user not found", });
                return;
            }
            const result = yield this._notificationService.markAllAsRead(userId);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, data: result, message: 'All notifications marked as read' });
        }));
        // Notify when user enrolls in a course
        this.notifyNewCourseEnrollment = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { courseName } = req.body;
            const userId = req.userId;
            if (!userId) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: 'Unauthorized access', });
                return;
            }
            const notification = yield this._notificationService.notifyNewCourseEnrollment(userId, courseName);
            res.status(statusCode_1.STATUS_CODES.CREATED).json({ success: true, notification });
        }));
        // Notify when consultation is scheduled
        this.notifyConsultationScheduled = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { consultationDate, consultationId } = req.body;
            const userId = req.userId;
            if (!userId) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: 'Unauthorized access', });
                return;
            }
            const notification = yield this._notificationService.notifyConsultationScheduled(userId, consultationDate, consultationId);
            res.status(statusCode_1.STATUS_CODES.CREATED).json({ success: true, notification });
        }));
        // Notify when subscription is expiring
        this.notifySubscriptionExpiring = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId, expiryDate } = req.body;
            const notification = yield this._notificationService.notifySubscriptionExpiring(userId, expiryDate);
            res.status(statusCode_1.STATUS_CODES.CREATED).json({ success: true, notification });
        }));
        // Notify all users about new course
        this.notifyNewCourseAvailable = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { courseName, courseId } = req.body;
            const notifications = yield this._notificationService.notifyNewCourseAvailable(courseName, courseId);
            res.status(statusCode_1.STATUS_CODES.CREATED).json({ success: true, notifications });
        }));
        this._notificationService = notificationService;
    }
}
exports.default = NotificationController;
