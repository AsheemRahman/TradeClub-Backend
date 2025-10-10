import { NextFunction, Request, Response } from "express";


type ControllerMethod = (req: Request, res: Response, next: NextFunction) => Promise<void>;


interface IOrderController {

    createCheckoutSession: ControllerMethod;
    createOrder: ControllerMethod;
    failedOrder: ControllerMethod;
    getPurchaseHistory: ControllerMethod;
    getPurchasedCourse: ControllerMethod;

    subscriptionCheckout: ControllerMethod;

    slotBooking: ControllerMethod;
    getSessionsByUser: ControllerMethod;
}


export default IOrderController;