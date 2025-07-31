import { Request, Response } from "express";


interface ISessionController {
    getSlots(req: Request, res: Response): Promise<void>;
    addSlot(req: Request, res: Response): Promise<void>;
    editSlot(req: Request, res: Response): Promise<void>;
    deleteSlot(req: Request, res: Response): Promise<void>;

    getDashboardStats(req: Request, res: Response): Promise<void>;
    getSessionAnalytics(req: Request, res: Response): Promise<void>;

    getSessions(req: Request, res: Response): Promise<void>;
}

export default ISessionController;