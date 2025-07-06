import { Request, Response } from "express";


interface IPaymentController {
    createCheckoutSession(req: Request, res: Response): Promise<void>;
}

export default IPaymentController;