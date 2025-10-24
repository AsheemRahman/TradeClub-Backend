"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verify_1 = require("../../middleware/verify");
const role_1 = require("../../constants/role");
const payoutDI_1 = require("../../di/payoutDI");
const router = (0, express_1.Router)();
// ----------------------------------- Payout -----------------------------------
router.post('/pending', (0, verify_1.validate)(role_1.ROLE.ADMIN), payoutDI_1.payoutController.getPendingPayouts.bind(payoutDI_1.payoutController));
router.post('/last-payout-date', (0, verify_1.validate)(role_1.ROLE.ADMIN), payoutDI_1.payoutController.getLastPayoutDate.bind(payoutDI_1.payoutController));
router.post('/run-payouts', (0, verify_1.validate)(role_1.ROLE.ADMIN), payoutDI_1.payoutController.runMonthlyPayouts.bind(payoutDI_1.payoutController));
exports.default = router;
