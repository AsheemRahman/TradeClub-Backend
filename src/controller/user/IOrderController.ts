import { Request, Response } from "express";


interface IOrderController {
    createCheckoutSession(req: Request, res: Response): Promise<void>;
    createOrder(req: Request, res: Response): Promise<void>;
    getPurchaseHistory(req: Request, res: Response): Promise<void>;
    getPurchasedCourse(req: Request, res: Response): Promise<void>;

    subscriptionCheckout(req: Request, res: Response): Promise<void>;
}

export default IOrderController;