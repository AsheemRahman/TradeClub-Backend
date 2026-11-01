"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = require("../../../constants/statusCode");
const errorMessage_1 = require("../../../constants/errorMessage");
const asyncHandler_1 = require("../../../utils/asyncHandler");
class NotificationController {
    _notificationService;
    constructor(notificationService) {
        this._notificationService = notificationService;
    }
    getNotifications = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        if (!userId) {
            res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.UNAUTHORIZED });
            return;
        }
        const { page = 1, limit = 20, unreadOnly = false } = req.query;
        const result = await this._notificationService.getUserNotifications(userId, {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            unreadOnly: unreadOnly === "true"
        });
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, data: result });
    });
    createNotification = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { userIds, title, message, type, actionUrl, priority, metadata } = req.body;
        let result;
        if (Array.isArray(userIds) && userIds.length > 1) {
            // Bulk notification
            result = await this._notificationService.createBulkNotifications(userIds, title, message, { type, actionUrl, priority, metadata });
        }
        else {
            // Single notification
            const userId = Array.isArray(userIds) ? userIds[0] : userIds;
            result = await this._notificationService.createNotification(userId, title, message, { type, actionUrl, priority, metadata });
        }
        res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, data: result, message: 'Notification(s) created successfully' });
    });
    markAsRead = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const userId = req.userId;
        if (!userId) {
            res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: "user not found", });
            return;
        }
        const notification = await this._notificationService.markAsRead(id, userId);
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, data: notification, message: 'Notification marked as read' });
    });
    markAllAsRead = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        if (!userId) {
            res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: "user not found", });
            return;
        }
        const result = await this._notificationService.markAllAsRead(userId);
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, data: result, message: 'All notifications marked as read' });
    });
    // Notify when user enrolls in a course
    notifyNewCourseEnrollment = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { courseName } = req.body;
        const userId = req.userId;
        if (!userId) {
            res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: 'Unauthorized access', });
            return;
        }
        const notification = await this._notificationService.notifyNewCourseEnrollment(userId, courseName);
        res.status(statusCode_1.STATUS_CODES.CREATED).json({ success: true, notification });
    });
    // Notify when consultation is scheduled
    notifyConsultationScheduled = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { consultationDate, consultationId } = req.body;
        const userId = req.userId;
        if (!userId) {
            res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: 'Unauthorized access', });
            return;
        }
        const notification = await this._notificationService.notifyConsultationScheduled(userId, consultationDate, consultationId);
        res.status(statusCode_1.STATUS_CODES.CREATED).json({ success: true, notification });
    });
    // Notify when subscription is expiring
    notifySubscriptionExpiring = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { userId, expiryDate } = req.body;
        const notification = await this._notificationService.notifySubscriptionExpiring(userId, expiryDate);
        res.status(statusCode_1.STATUS_CODES.CREATED).json({ success: true, notification });
    });
    // Notify all users about new course
    notifyNewCourseAvailable = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { courseName, courseId } = req.body;
        const notifications = await this._notificationService.notifyNewCourseAvailable(courseName, courseId);
        res.status(statusCode_1.STATUS_CODES.CREATED).json({ success: true, notifications });
    });
}
exports.default = NotificationController;
//# sourceMappingURL=notificationController.js.map