import { NextFunction, Request, Response } from "express";

type ControllerMethod = (req: Request, res: Response, next: NextFunction) => Promise<void>;

interface ISessionController {
    getSlots: ControllerMethod;
    addSlot: ControllerMethod;
    editSlot: ControllerMethod;
    deleteSlot: ControllerMethod;

    getDashboardStats: ControllerMethod;
    getSessionAnalytics: ControllerMethod;

    getSessions: ControllerMethod;
}

export default ISessionController;