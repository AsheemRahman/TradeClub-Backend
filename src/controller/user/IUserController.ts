import { NextFunction, Request, Response } from "express";


type ControllerMethod = (req: Request, res: Response, next: NextFunction) => Promise<void>;


interface IUserController {
    registerPost: ControllerMethod;
    verifyOtp: ControllerMethod;
    resendOtp: ControllerMethod;
    loginPost: ControllerMethod;
    logout: ControllerMethod;
    googleLogin: ControllerMethod;
    refreshToken: ControllerMethod;
    forgotPassword: ControllerMethod;
    resetPassword: ControllerMethod;

    getProfile: ControllerMethod;
    updateProfile: ControllerMethod;

    fetchPlans: ControllerMethod;
    getSessions: ControllerMethod;
    getSessionById: ControllerMethod;
    updateSession: ControllerMethod;
    cancelSession: ControllerMethod;

    getAllExpert: ControllerMethod;
    getExpertById: ControllerMethod;
    getExpertAvailability: ControllerMethod;
    checkSubscription: ControllerMethod;
}

export default IUserController;