import ISubscriptionService from "../ISubscriptionService";
import ISubscriptionRepository from "../../../repository/admin/ISubscriptionRepository";
import { ISubscriptionPlan } from "../../../model/admin/subscriptionSchema";



class SubscriptionService implements ISubscriptionService {

    private subscriptionRepository: ISubscriptionRepository;

    constructor(subscriptionRepository: ISubscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    async fetchPlans(): Promise<ISubscriptionPlan[] | null> {
        const planData = await this.subscriptionRepository.fetchPlans();
        return planData;
    }

    async createPlan(planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null> {
        const Data = await this.subscriptionRepository.createPlan(planData);
        return Data;
    }
}

export default SubscriptionService;