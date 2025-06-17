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

    async getPlanById(id: string): Promise<ISubscriptionPlan | null> {
        const plan = await this.subscriptionRepository.getPlanById(id);
        return plan;
    }

    async createPlan(planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null> {
        const Data = await this.subscriptionRepository.createPlan(planData);
        return Data;
    }

    async updatePlan(id: string, planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null> {
        const Data = await this.subscriptionRepository.updatePlan(id, planData);
        return Data;
    }

    async deletePlan(id: string): Promise<ISubscriptionPlan | null> {
        const course = await this.subscriptionRepository.deletePlan(id);
        return course;
    }

    async planStatus(id: string, status: boolean): Promise<ISubscriptionPlan | null> {
        const course = await this.subscriptionRepository.planStatus(id, status);
        return course;
    }
}

export default SubscriptionService;