import { ISubscriptionPlan } from "../../model/admin/subscriptionSchema";


interface ISubscriptionService {
    fetchPlans(): Promise<ISubscriptionPlan[] | null>;
    getPlanById(id: string): Promise<ISubscriptionPlan | null>;
    createPlan(planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null>;
    updatePlan(id: string, planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null>;
}

export default ISubscriptionService;