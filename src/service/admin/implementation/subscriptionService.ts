import ISubscriptionService from "../ISubscriptionService";
import ISubscriptionRepository from "../../../repository/admin/ISubscriptionRepository";
import { ISubscriptionPlan } from "../../../model/admin/subscriptionSchema";
import { ICoupon } from "../../../model/admin/couponSchema";



class SubscriptionService implements ISubscriptionService {

    private _subscriptionRepository: ISubscriptionRepository;

    constructor(subscriptionRepository: ISubscriptionRepository) {
        this._subscriptionRepository = subscriptionRepository;
    }

    //--------------------------- Subscription ---------------------------

    async fetchPlans(): Promise<ISubscriptionPlan[] | null> {
        const planData = await this._subscriptionRepository.fetchPlans();
        return planData;
    }

    async getPlanById(planId: string): Promise<ISubscriptionPlan | null> {
        const plan = await this._subscriptionRepository.getPlanById(planId);
        return plan;
    }

    async createPlan(planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null> {
        const Data = await this._subscriptionRepository.createPlan(planData);
        return Data;
    }

    async updatePlan(planId: string, planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null> {
        const Data = await this._subscriptionRepository.updatePlan(planId, planData);
        return Data;
    }

    async deletePlan(planId: string): Promise<ISubscriptionPlan | null> {
        const plan = await this._subscriptionRepository.deletePlan(planId);
        return plan;
    }

    async planStatus(planId: string, status: boolean): Promise<ISubscriptionPlan | null> {
        const plan = await this._subscriptionRepository.planStatus(planId, status);
        return plan;
    }

    //--------------------------- Subscription ---------------------------

    async fetchCoupons(): Promise<ICoupon[] | null> {
        const coupons = await this._subscriptionRepository.fetchCoupons();
        return coupons;
    }

    async getCouponById(couponId: string): Promise<ICoupon | null> {
        const couponData = await this._subscriptionRepository.getCouponById(couponId);
        return couponData;
    }

    async createCoupon(couponData: Partial<ICoupon>): Promise<ICoupon | null> {
        const newCoupon = await this._subscriptionRepository.createCoupon(couponData);
        return newCoupon;
    }

    async updateCoupon(couponId: string, couponData: Partial<ICoupon>): Promise<ICoupon | null> {
        const coupon = await this._subscriptionRepository.updateCoupon(couponId, couponData);
        return coupon;
    }

    async deleteCoupon(couponId: string): Promise<ICoupon | null> {
        const coupon = await this._subscriptionRepository.deleteCoupon(couponId);
        return coupon;
    }

    async CouponStatus(couponId: string, status: boolean): Promise<ICoupon | null> {
        const coupon = await this._subscriptionRepository.couponStatus(couponId, status);
        return coupon;
    }
}

export default SubscriptionService;