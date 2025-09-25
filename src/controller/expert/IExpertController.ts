import { NextFunction, Request, Response } from "express";

type ControllerMethod = (req: Request, res: Response, next: NextFunction) => Promise<any>;

interface IExpertController {

    registerPost: ControllerMethod;
    verifyOtp: ControllerMethod;
    resendOtp: ControllerMethod;
    loginPost: ControllerMethod;
    logout: ControllerMethod;
    googleLogin: ControllerMethod;

    forgotPassword: ControllerMethod;
    resetPassword: ControllerMethod;

    expertVerification: ControllerMethod;

    getExpertData: ControllerMethod;
    updateProfile: ControllerMethod;

    getWallet: ControllerMethod;
}

export default IExpertController;