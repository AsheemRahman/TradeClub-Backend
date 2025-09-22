import { Request, Response } from "express";
import INotificationService from "../../../service/user/INotificationService";
import INotificationController from "../INotificationController";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/message";


class NotificationController implements INotificationController {
    private _notificationService: INotificationService;
    constructor(notificationService: INotificationService) {
        this._notificationService = notificationService;
    }

    async getNotifications(req: Request, res: Response): Promise<void> {
        try {
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
        } catch (error) {
            console.error('Get notifications error:', error);
            if (error instanceof Error) {
                res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
            } else {
                res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "An unknown error occurred" });
            }
        }
    }

    async createNotification(req: Request, res: Response): Promise<void> {
        try {
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
        } catch (error) {
            console.error('Create notification error:', error);
            if (error instanceof Error) {
                res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
            } else {
                res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "An unknown error occurred" });
            }
        }
    }

    async markAsRead(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.userId;
            if (!userId) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ status: false, message: "user not found", });
                return;
            }
            const notification = await this._notificationService.markAsRead(id, userId);
            res.status(STATUS_CODES.OK).json({ status: true, data: notification, message: 'Notification marked as read' });
        } catch (error) {
            console.error('Mark as read error:', error);
            if (error instanceof Error) {
                res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
            } else {
                res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "An unknown error occurred" });
            }
        }
    }

    async markAllAsRead(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ status: false, message: "user not found", });
                return;
            }
            const result = await this._notificationService.markAllAsRead(userId);
            res.status(STATUS_CODES.OK).json({ status: true, data: result, message: 'All notifications marked as read' });
        } catch (error) {
            console.error('Mark all as read error:', error);
            if (error instanceof Error) {
                res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
            } else {
                res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "An unknown error occurred" });
            }
        }
    }

    // Notify when user enrolls in a course
    async notifyNewCourseEnrollment(req: Request, res: Response): Promise<void> {
        try {
            const { courseName } = req.body;
            const userId = req.userId;
            if (!userId) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ status: false, message: 'Unauthorized access', });
                return
            }
            const notification = await this._notificationService.notifyNewCourseEnrollment(userId, courseName);
            res.status(STATUS_CODES.CREATED).json({ success: true, notification });
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    }

    // Notify when consultation is scheduled
    async notifyConsultationScheduled(req: Request, res: Response): Promise<void> {
        try {
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
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    }

    // Notify when subscription is expiring
    async notifySubscriptionExpiring(req: Request, res: Response): Promise<void> {
        try {
            const { userId, expiryDate } = req.body;
            const notification = await this._notificationService.notifySubscriptionExpiring(userId, expiryDate);
            res.status(STATUS_CODES.CREATED).json({ success: true, notification });
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    }

    // Notify all users about new course
    async notifyNewCourseAvailable(req: Request, res: Response): Promise<void> {
        try {
            const { courseName, courseId } = req.body;
            const notifications = await this._notificationService.notifyNewCourseAvailable(courseName, courseId);
            res.status(STATUS_CODES.CREATED).json({ success: true, notifications });
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    }

}

export default NotificationController;