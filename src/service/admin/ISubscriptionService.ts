import { ISubscriptionPlan } from "../../model/admin/subscriptionSchema";


interface ISubscriptionService {
    fetchPlans(): Promise<ISubscriptionPlan[] | null>;

}

export default ISubscriptionService;