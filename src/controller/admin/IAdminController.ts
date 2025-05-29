import { Request, Response } from "express"

interface IAdminController {

    adminLogin(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;

    getUsers(req: Request, res: Response): Promise<void>;
    userStatus(req: Request, res: Response): Promise<void>;

    getExperts(req: Request, res: Response): Promise<void>;
    expertStatus(req: Request, res: Response): Promise<void>;
    expertDetail(req: Request, res: Response): Promise<void>;
    approveExpert(req: Request, res: Response): Promise<void>;
    declineExpert(req: Request, res: Response): Promise<void>;
}

export default IAdminController;