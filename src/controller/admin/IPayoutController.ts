import { Request, Response } from "express"

interface IPayoutController {
    runMonthlyPayouts(req: Request, res: Response): Promise<void>;
}

export default IPayoutController;