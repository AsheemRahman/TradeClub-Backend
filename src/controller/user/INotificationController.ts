import { Request, Response } from "express";


interface INotificationController {
    getNotifications(req: Request, res: Response): Promise<void>;
    createNotification(req: Request, res: Response): Promise<void>;
    markAsRead(req: Request, res: Response): Promise<void>;
    markAllAsRead(req: Request, res: Response): Promise<void>;

    notifyNewCourseEnrollment(req: Request, res: Response): Promise<void>
    notifyConsultationScheduled(req: Request, res: Response): Promise<void>
    notifySubscriptionExpiring(req: Request, res: Response): Promise<void>
    notifyNewCourseAvailable(req: Request, res: Response): Promise<void>
}

export default INotificationController;