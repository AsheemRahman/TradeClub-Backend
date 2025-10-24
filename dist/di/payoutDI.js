"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payoutController = void 0;
const payoutService_1 = __importDefault(require("../service/admin/implementation/payoutService"));
const payoutController_1 = __importDefault(require("../controller/admin/implementation/payoutController"));
const earningRepository_1 = __importDefault(require("../repository/expert/implementation/earningRepository"));
const expertRepository_1 = __importDefault(require("../repository/expert/implementation/expertRepository"));
const expertRepository = new expertRepository_1.default();
const earningRepository = new earningRepository_1.default();
const payoutService = new payoutService_1.default(expertRepository, earningRepository);
const payoutController = new payoutController_1.default(payoutService);
exports.payoutController = payoutController;
