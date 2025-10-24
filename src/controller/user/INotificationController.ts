import { NextFunction, Request, Response } from "express";


type ControllerMethod = (req: Request, res: Response, next: NextFunction) => Promise<void>;


interface INotificationController {
    getNotifications: ControllerMethod;
    createNotification: ControllerMethod;
    markAsRead: ControllerMethod;
    markAllAsRead: ControllerMethod;

    notifyNewCourseEnrollment: ControllerMethod;
    notifyConsultationScheduled: ControllerMethod;
    notifySubscriptionExpiring: ControllerMethod;
    notifyNewCourseAvailable: ControllerMethod;
}

export default INotificationController;