"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = require("../../../constants/statusCode");
const asyncHandler_1 = require("../../../utils/asyncHandler");
class PayoutController {
    constructor(payoutService) {
        this.runMonthlyPayouts = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this._payoutService.processMonthlyPayouts();
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Monthly payouts processed successfully" });
        }));
        this.getPendingPayouts = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const payouts = yield this._payoutService.getPendingPayouts();
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, data: payouts });
        }));
        this.getLastPayoutDate = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const date = yield this._payoutService.getLastPayoutDate();
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, data: { lastPayoutDate: date } });
        }));
        this._payoutService = payoutService;
    }
}
exports.default = PayoutController;
