import { Request, Response } from "express";
import INotificationService from "../../../service/user/INotificationService";
import INotificationController from "../INotificationController";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/errorMessage";
import { asyncHandler } from "../../../utils/asyncHandler";


class NotificationController implements INotificationController {
    private _notificationService: INotificationService;
    constructor(notificationService: INotificationService) {
        this._notificationService = notificationService;
    }

    getNotifications = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.userId;
        if (!userId) {
            res.status(STATUS_CODES.UNAUTHORIZED).json({ status: false, message: ERROR_MESSAGES.UNAUTHORIZED });
            return;
        }
        const { page = 1, limit = 20, unreadOnly = false } = req.query;
        const result = await this._notificationService.getUserNotifications(userId, {
            page: parseInt(page as string, 10),
            limit: parseInt(limit as string, 10),
            unreadOnly: (unreadOnly as string) === "true"
        });
        res.status(STATUS_CODES.OK).json({ status: true, data: result });
    });

    createNotification = asyncHandler(async (req: Request, res: Response) => {
        const { userIds, title, message, type, actionUrl, priority, metadata } = req.body;
        let result;
        if (Array.isArray(userIds) && userIds.length > 1) {
            // Bulk notification
            result = await this._notificationService.createBulkNotifications(
                userIds, title, message, { type, actionUrl, priority, metadata }
            );
        } else {
            // Single notification
            const userId = Array.isArray(userIds) ? userIds[0] : userIds;
            result = await this._notificationService.createNotification(
                userId, title, message, { type, actionUrl, priority, metadata }
            );
        }
        res.status(STATUS_CODES.CREATED).json({ status: true, data: result, message: 'Notification(s) created successfully' });
    });

    markAsRead = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.userId;
        if (!userId) {
            res.status(STATUS_CODES.UNAUTHORIZED).json({ status: false, message: "user not found", });
            return;
        }
        const notification = await this._notificationService.markAsRead(id, userId);
        res.status(STATUS_CODES.OK).json({ status: true, data: notification, message: 'Notification marked as read' });
    });

    markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.userId;
        if (!userId) {
            res.status(STATUS_CODES.UNAUTHORIZED).json({ status: false, message: "user not found", });
            return;
        }
        const result = await this._notificationService.markAllAsRead(userId);
        res.status(STATUS_CODES.OK).json({ status: true, data: result, message: 'All notifications marked as read' });
    });

    // Notify when user enrolls in a course
    notifyNewCourseEnrollment = asyncHandler(async (req: Request, res: Response) => {
        const { courseName } = req.body;
        const userId = req.userId;
        if (!userId) {
            res.status(STATUS_CODES.UNAUTHORIZED).json({ status: false, message: 'Unauthorized access', });
            return
        }
        const notification = await this._notificationService.notifyNewCourseEnrollment(userId, courseName);
        res.status(STATUS_CODES.CREATED).json({ success: true, notification });
    });

    // Notify when consultation is scheduled
    notifyConsultationScheduled = asyncHandler(async (req: Request, res: Response) => {
        const { consultationDate, consultationId } = req.body;
        const userId = req.userId;
        if (!userId) {
            res.status(STATUS_CODES.UNAUTHORIZED).json({ status: false, message: 'Unauthorized access', });
            return
        }
        const notification = await this._notificationService.notifyConsultationScheduled(
            userId,
            consultationDate,
            consultationId
        );
        res.status(STATUS_CODES.CREATED).json({ success: true, notification });
    });

    // Notify when subscription is expiring
    notifySubscriptionExpiring = asyncHandler(async (req: Request, res: Response) => {
        const { userId, expiryDate } = req.body;
        const notification = await this._notificationService.notifySubscriptionExpiring(userId, expiryDate);
        res.status(STATUS_CODES.CREATED).json({ success: true, notification });
    });

    // Notify all users about new course
    notifyNewCourseAvailable = asyncHandler(async (req: Request, res: Response) => {
        const { courseName, courseId } = req.body;
        const notifications = await this._notificationService.notifyNewCourseAvailable(courseName, courseId);
        res.status(STATUS_CODES.CREATED).json({ success: true, notifications });
    });

}

export default NotificationController;