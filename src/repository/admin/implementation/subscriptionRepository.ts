import SubscriptionPlan, { ISubscriptionPlan } from "../../../model/admin/subscriptionSchema";
import ISubscriptionRepository from "../ISubscriptionRepository";


class SubscriptionRepository implements ISubscriptionRepository {

    async fetchPlans(): Promise<ISubscriptionPlan[] | null> {
        const plans = await SubscriptionPlan.find().sort({ createdAt: -1 });
        return plans;
    }

    async createPlan(planData :ISubscriptionPlan): Promise<ISubscriptionPlan | null> {
        const newPlan = await SubscriptionPlan.create(planData);
        return newPlan;
    }
}

export default SubscriptionRepository;