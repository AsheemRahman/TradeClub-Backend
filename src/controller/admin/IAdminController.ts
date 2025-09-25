import { NextFunction, Request, Response } from "express"

type ControllerMethod = (req: Request, res: Response, next: NextFunction) => Promise<void>;

interface IAdminController {

    //----------------------- Auth -----------------------

    adminLogin: ControllerMethod;
    logout: ControllerMethod;
    refreshToken: ControllerMethod;

    //----------------------- User -----------------------

    getUsers: ControllerMethod;
    getUserById: ControllerMethod;
    userStatus: ControllerMethod;

    //----------------------- Expert -----------------------

    getExperts: ControllerMethod;
    expertStatus: ControllerMethod;
    expertDetail: ControllerMethod;
    approveExpert: ControllerMethod;
    declineExpert: ControllerMethod;

    //----------------------- Order -----------------------

    getOrders: ControllerMethod;
    getRevenue: ControllerMethod;
}

export default IAdminController;