import { ISubscriptionPlan } from "../../model/admin/subscriptionSchema";


interface ISubscriptionRepository {
    fetchPlans(): Promise<ISubscriptionPlan[] | null>;
    createPlan(planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null>;
}

export default ISubscriptionRepository;