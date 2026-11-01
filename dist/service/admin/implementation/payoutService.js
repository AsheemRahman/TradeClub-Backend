"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-06-30.basil' });
class PayoutService {
    _expertRepository;
    _earningRepository;
    constructor(expertRepository, earningRepository) {
        this._expertRepository = expertRepository;
        this._earningRepository = earningRepository;
    }
    async getPendingPayouts() {
        return await this._earningRepository.getPendingPayouts();
    }
    async getLastPayoutDate() {
        return await this._earningRepository.getLastPayoutDate();
    }
    async processMonthlyPayouts() {
        const experts = await this._earningRepository.aggregatePending();
        for (const expert of experts) {
            const expertId = expert._id.toString();
            const total = expert.total;
            const expertData = await this._expertRepository.getExpertById(expertId);
            if (!expertData?.stripeAccountId)
                continue;
            try {
                await stripe.transfers.create({
                    amount: total * 100,
                    currency: "inr",
                    destination: expertData.stripeAccountId,
                    description: `Monthly payout for Expert ${expertId}`
                });
                await this._earningRepository.markAsPaid(expertId);
                console.error(`✅ Paid ₹${total} to ${expertData.fullName}`);
            }
            catch (err) {
                console.error("Stripe payout error:", err);
            }
        }
    }
}
exports.default = PayoutService;
//# sourceMappingURL=payoutService.js.map