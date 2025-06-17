import SubscriptionPlan, { ISubscriptionPlan } from "../../../model/admin/subscriptionSchema";
import ISubscriptionRepository from "../ISubscriptionRepository";


class SubscriptionRepository implements ISubscriptionRepository {

    async fetchPlans(): Promise<ISubscriptionPlan[] | null> {
        const plans = await SubscriptionPlan.find().sort({ createdAt: -1 });
        return plans;
    }

    async getPlanById(id: string): Promise<ISubscriptionPlan | null> {
        const plan = await SubscriptionPlan.findById(id);
        return plan;
    }

    async createPlan(planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null> {
        const newPlan = await SubscriptionPlan.create(planData);
        return newPlan;
    }

    async updatePlan(id: string, planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null> {
        const updatePlan = await SubscriptionPlan.findByIdAndUpdate(id, { ...planData }, { new: true });
        return updatePlan;
    }
}

export default SubscriptionRepository;