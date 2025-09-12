import { Request, Response } from "express";


interface IUserController {
    registerPost(req: Request, res: Response): Promise<void>;
    verifyOtp(req: Request, res: Response): Promise<void>;
    resendOtp(req: Request, res: Response): Promise<void>;
    loginPost(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    googleLogin(req: Request, res: Response): Promise<void>;
    refreshToken(req: Request, res: Response): Promise<void>;
    forgotPassword(req: Request, res: Response): Promise<void>;
    resetPassword(req: Request, res: Response): Promise<void>;

    getProfile(req: Request, res: Response): Promise<void>;
    updateProfile(req: Request, res: Response): Promise<void>;

    fetchPlans(req: Request, res: Response): Promise<void>;
    getSessions(req: Request, res: Response): Promise<void>;
    getSessionById(req: Request, res: Response): Promise<void>;
    updateSession(req: Request, res: Response): Promise<void>;

    getAllExpert(req: Request, res: Response): Promise<void>;
    getExpertById(req: Request, res: Response): Promise<void>;
    getExpertAvailability(req: Request, res: Response): Promise<void>;
    checkSubscription(req: Request, res: Response): Promise<void>;
}

export default IUserController;