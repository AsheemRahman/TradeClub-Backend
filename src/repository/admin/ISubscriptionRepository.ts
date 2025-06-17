import { ISubscriptionPlan } from "../../model/admin/subscriptionSchema";


interface ISubscriptionRepository {
    fetchPlans(): Promise<ISubscriptionPlan[] | null>;
    getPlanById(id: string): Promise<ISubscriptionPlan | null>;
    createPlan(planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null>;
    updatePlan(id: string, planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null>;
    deletePlan(id: string): Promise<ISubscriptionPlan | null>;
    planStatus(id: string, status: boolean): Promise<ISubscriptionPlan | null>;
}

export default ISubscriptionRepository;