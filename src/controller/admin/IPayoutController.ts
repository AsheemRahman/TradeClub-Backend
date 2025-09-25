import { Request, Response, NextFunction } from "express";

type ControllerMethod = (req: Request, res: Response, next: NextFunction) => Promise<any>;

interface IPayoutController {
    getPendingPayouts: ControllerMethod;
    getLastPayoutDate: ControllerMethod;
    runMonthlyPayouts: ControllerMethod;
}


export default IPayoutController;