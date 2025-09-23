import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants/statusCode";

import IPayoutController from "../IPayoutController";
import IPayoutService from "../../../service/admin/IPayoutService";
import { ERROR_MESSAGES } from "../../../constants/message";


class PayoutController implements IPayoutController {

    private _payoutService: IPayoutService;

    constructor(payoutService: IPayoutService) {
        this._payoutService = payoutService;
    }

    async runMonthlyPayouts(req: Request, res: Response): Promise<void> {
        try {
            await this._payoutService.processMonthlyPayouts();
            res.status(STATUS_CODES.OK).json({status: true, message: "Monthly payouts processed successfully" });
        } catch (error) {
            console.error("Failed Monthly payouts", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed Monthly payouts" });
        }
    };
    
    async getPendingPayouts(req: Request, res: Response): Promise<void>  {
        try {
            const payouts = await this._payoutService.getPendingPayouts();
            res.status(STATUS_CODES.OK).json({status: true, data: payouts });
        } catch (error) {
            console.error("get pending payouts", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message: "error while get pending payouts"});
        }
    };

    async getLastPayoutDate(req: Request, res: Response): Promise<void>  {
        try {
            const date = await this._payoutService.getLastPayoutDate();
            res.status(STATUS_CODES.OK).json({status: true, data: { lastPayoutDate: date } });
        } catch (err) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    };
}

export default PayoutController;