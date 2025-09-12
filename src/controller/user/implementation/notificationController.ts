import { Request, Response } from "express";
import INotificationService from "../../../service/user/INotificationService";
import INotificationController from "../INotificationController";


class NotificationController implements INotificationController {
    private _notificationService: INotificationService;
    constructor(notificationService: INotificationService) {
        this._notificationService = notificationService;
    }

    async getNotifications(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({ status: false, message: "user not found", });
                return;
            }
            const { page = 1, limit = 20, unreadOnly = false } = req.query;
            const result = await this._notificationService.getUserNotifications(userId, {
                page: parseInt(page as string, 10),
                limit: parseInt(limit as string, 10),
                unreadOnly: (unreadOnly as string) === "true"
            });
            res.status(200).json({ status: true, data: result });
        } catch (error) {
            console.error('Get notifications error:', error);
            if (error instanceof Error) {
                res.status(500).json({ status: false, message: error.message });
            } else {
                res.status(500).json({ status: false, message: "An unknown error occurred" });
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
            res.status(201).json({ status: true, data: result, message: 'Notification(s) created successfully' });
        } catch (error) {
            console.error('Create notification error:', error);
            if (error instanceof Error) {
                res.status(500).json({ status: false, message: error.message });
            } else {
                res.status(500).json({ status: false, message: "An unknown error occurred" });
            }
        }
    }

    async markAsRead(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({ status: false, message: "user not found", });
                return;
            }
            const notification = await this._notificationService.markAsRead(id, userId);
            res.status(200).json({ status: true, data: notification, message: 'Notification marked as read' });
        } catch (error) {
            console.error('Mark as read error:', error);
            if (error instanceof Error) {
                res.status(500).json({ status: false, message: error.message });
            } else {
                res.status(500).json({ status: false, message: "An unknown error occurred" });
            }
        }
    }

    async markAllAsRead(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({ status: false, message: "user not found", });
                return;
            }
            const result = await this._notificationService.markAllAsRead(userId);
            res.status(200).json({ status: true, data: result, message: 'All notifications marked as read' });
        } catch (error) {
            console.error('Mark all as read error:', error);
            if (error instanceof Error) {
                res.status(500).json({ status: false, message: error.message });
            } else {
                res.status(500).json({ status: false, message: "An unknown error occurred" });
            }
        }
    }
}

export default NotificationController;