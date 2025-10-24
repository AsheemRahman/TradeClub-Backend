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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-06-30.basil' });
class PayoutService {
    constructor(expertRepository, earningRepository) {
        this._expertRepository = expertRepository;
        this._earningRepository = earningRepository;
    }
    getPendingPayouts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._earningRepository.getPendingPayouts();
        });
    }
    getLastPayoutDate() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._earningRepository.getLastPayoutDate();
        });
    }
    processMonthlyPayouts() {
        return __awaiter(this, void 0, void 0, function* () {
            const experts = yield this._earningRepository.aggregatePending();
            for (const expert of experts) {
                const expertId = expert._id.toString();
                const total = expert.total;
                const expertData = yield this._expertRepository.getExpertById(expertId);
                if (!(expertData === null || expertData === void 0 ? void 0 : expertData.stripeAccountId))
                    continue;
                try {
                    yield stripe.transfers.create({
                        amount: total * 100,
                        currency: "inr",
                        destination: expertData.stripeAccountId,
                        description: `Monthly payout for Expert ${expertId}`
                    });
                    yield this._earningRepository.markAsPaid(expertId);
                    console.error(`✅ Paid ₹${total} to ${expertData.fullName}`);
                }
                catch (err) {
                    console.error("Stripe payout error:", err);
                }
            }
        });
    }
}
exports.default = PayoutService;
