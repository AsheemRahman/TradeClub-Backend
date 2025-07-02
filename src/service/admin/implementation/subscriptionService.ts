import ISubscriptionService from "../ISubscriptionService";
import ISubscriptionRepository from "../../../repository/admin/ISubscriptionRepository";
import { ISubscriptionPlan } from "../../../model/admin/subscriptionSchema";
import { ICoupon } from "../../../model/admin/couponSchema";



class SubscriptionService implements ISubscriptionService {

    private subscriptionRepository: ISubscriptionRepository;

    constructor(subscriptionRepository: ISubscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    //--------------------------- Subscription ---------------------------

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
        const plan = await this.subscriptionRepository.deletePlan(id);
        return plan;
    }

    async planStatus(id: string, status: boolean): Promise<ISubscriptionPlan | null> {
        const plan = await this.subscriptionRepository.planStatus(id, status);
        return plan;
    }

    //--------------------------- Subscription ---------------------------

    async fetchCoupons(): Promise<ICoupon[] | null> {
        const coupons = await this.subscriptionRepository.fetchCoupons();
        return coupons;
    }

    async getCouponById(id: string): Promise<ICoupon | null> {
        const couponData = await this.subscriptionRepository.getCouponById(id);
        return couponData;
    }

    async createCoupon(couponData: Partial<ICoupon>): Promise<ICoupon | null> {
        const newCoupon = await this.subscriptionRepository.createCoupon(couponData);
        return newCoupon;
    }

    async updateCoupon(id: string, couponData: Partial<ICoupon>): Promise<ICoupon | null> {
        const coupon = await this.subscriptionRepository.updateCoupon(id, couponData);
        return coupon;
    }

    async deleteCoupon(id: string): Promise<ICoupon | null> {
        const coupon = await this.subscriptionRepository.deleteCoupon(id);
        return coupon;
    }

    async CouponStatus(id: string, status: boolean): Promise<ICoupon | null> {
        const coupon = await this.subscriptionRepository.couponStatus(id, status);
        return coupon;
    }
}

export default SubscriptionService;