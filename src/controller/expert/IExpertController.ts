import { Request, Response } from "express";


interface IExpertController {
    
    registerPost(req: Request, res: Response): Promise<void>;
    verifyOtp(req: Request, res: Response): Promise<void>;
    resendOtp(req: Request, res: Response): Promise<void>;
    loginPost(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    googleLogin(req: Request, res: Response): Promise<void>;

    forgotPassword(req: Request, res: Response): Promise<void>;
    resetPassword(req: Request, res: Response): Promise<void>;

    expertVerification(req: Request, res: Response): Promise<void>;

    getExpertData(req: Request, res: Response): Promise<void>;
}

export default IExpertController;