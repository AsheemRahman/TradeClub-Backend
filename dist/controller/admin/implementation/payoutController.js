"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = require("../../../constants/statusCode");
const asyncHandler_1 = require("../../../utils/asyncHandler");
class PayoutController {
    _payoutService;
    constructor(payoutService) {
        this._payoutService = payoutService;
    }
    runMonthlyPayouts = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await this._payoutService.processMonthlyPayouts();
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Monthly payouts processed successfully" });
    });
    getPendingPayouts = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const payouts = await this._payoutService.getPendingPayouts();
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, data: payouts });
    });
    getLastPayoutDate = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const date = await this._payoutService.getLastPayoutDate();
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, data: { lastPayoutDate: date } });
    });
}
exports.default = PayoutController;
//# sourceMappingURL=payoutController.js.map