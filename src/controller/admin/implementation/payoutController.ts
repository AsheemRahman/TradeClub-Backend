import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants/statusCode";

import IPayoutController from "../IPayoutController";
import IPayoutService from "../../../service/admin/IPayoutService";


class PayoutController implements IPayoutController {

    private _payoutService: IPayoutService;

    constructor(payoutService: IPayoutService) {
        this._payoutService = payoutService;
    }

    async runMonthlyPayouts(req: Request, res: Response): Promise<void> {
        try {
            await this._payoutService.processMonthlyPayouts();
            res.status(STATUS_CODES.OK).json({ message: "Monthly payouts processed successfully" });
        } catch (error) {
            console.error("Failed to fetch Subscription plan", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed Monthly payouts" });
        }
    };
}

export default PayoutController;