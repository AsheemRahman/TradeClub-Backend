import { Request, Response } from "express"

interface IPayoutController {
    getPendingPayouts(req: Request, res: Response): Promise<void>;
    getLastPayoutDate(req: Request, res: Response): Promise<void>
    runMonthlyPayouts(req: Request, res: Response): Promise<void>;
}

export default IPayoutController;