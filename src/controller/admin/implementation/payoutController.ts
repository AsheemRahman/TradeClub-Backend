import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants/statusCode";

import IPayoutController from "../IPayoutController";
import IPayoutService from "../../../service/admin/IPayoutService";
import { asyncHandler } from "../../../utils/asyncHandler";


class PayoutController implements IPayoutController {

    private _payoutService: IPayoutService;

    constructor(payoutService: IPayoutService) {
        this._payoutService = payoutService;
    }

    runMonthlyPayouts = asyncHandler(async (req: Request, res: Response) => {
        await this._payoutService.processMonthlyPayouts();
        res.status(STATUS_CODES.OK).json({ status: true, message: "Monthly payouts processed successfully" });
    });

    getPendingPayouts = asyncHandler(async (req: Request, res: Response) => {
        const payouts = await this._payoutService.getPendingPayouts();
        res.status(STATUS_CODES.OK).json({ status: true, data: payouts });
    });

    getLastPayoutDate = asyncHandler(async (req: Request, res: Response) => {
        const date = await this._payoutService.getLastPayoutDate();
        res.status(STATUS_CODES.OK).json({ status: true, data: { lastPayoutDate: date } });
    });
}

export default PayoutController;