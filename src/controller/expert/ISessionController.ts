import { Request, Response } from "express";


interface ISessionController {
    getSessions(req: Request, res: Response): Promise<void>;
    addSession(req: Request, res: Response): Promise<void>;
    editSession(req: Request, res: Response): Promise<void>;
    deleteSession(req: Request, res: Response): Promise<void>;

    getDashboardStats(req: Request, res: Response): Promise<void>;
    getSessionAnalytics(req: Request, res: Response): Promise<void>;
}

export default ISessionController;