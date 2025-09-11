import Stripe from "stripe";
import IPayoutService from "../IPayoutService";
import IExpertRepository from "../../../repository/expert/IExpertRepository";
import IEarningRepository from "../../../repository/expert/IEarningRepository";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-06-30.basil' });


class PayoutService implements IPayoutService {

    private _expertRepository: IExpertRepository;
    private _earningRepository: IEarningRepository;

    constructor(expertRepository: IExpertRepository, earningRepository: IEarningRepository) {
        this._expertRepository = expertRepository;
        this._earningRepository = earningRepository;
    }

    async processMonthlyPayouts() {
        const experts = await this._earningRepository.aggregatePending();

        for (const expert of experts) {
            const expertId = expert._id.toString();
            const total = expert.total;

            const expertData = await this._expertRepository.getExpertById(expertId);
            if (!expertData?.stripeAccountId) continue;

            try {
                await stripe.transfers.create({
                    amount: total * 100,
                    currency: "inr",
                    destination: expertData.stripeAccountId,
                    description: `Monthly payout for Expert ${expertId}`
                });

                await this._earningRepository.markAsPaid(expertId);
                console.log(`✅ Paid ₹${total} to ${expertData.fullName}`);
            } catch (err) {
                console.error("Stripe payout error:", err);
            }
        }
    }

}

export default PayoutService;