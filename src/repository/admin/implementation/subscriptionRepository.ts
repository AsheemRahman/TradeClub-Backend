import { Coupon, ICoupon } from "../../../model/admin/couponSchema";
import { SubscriptionPlan, ISubscriptionPlan } from "../../../model/admin/subscriptionSchema";
import { BaseRepository } from "../../base/implementation/BaseRepository";
import ISubscriptionRepository from "../ISubscriptionRepository";


class SubscriptionRepository extends BaseRepository<ISubscriptionPlan> implements ISubscriptionRepository {
    private couponModel = Coupon;

    constructor() {
        super(SubscriptionPlan);
    }

    //------------------------- Subscription -------------------------

    async fetchPlans(): Promise<ISubscriptionPlan[] | null> {
        const plans = await this.model.find().sort({ createdAt: -1 });
        return plans;
    }

    async getPlanById(planId: string): Promise<ISubscriptionPlan | null> {
        return await this.findById(planId);
    }

    async createPlan(planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null> {
        return await this.create(planData);
    }

    async updatePlan(planId: string, planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null> {
        const updatePlan = await this.findByIdAndUpdate(planId, { ...planData });
        return updatePlan;
    }

    async deletePlan(planId: string): Promise<ISubscriptionPlan | null> {
        const plan = await this.delete(planId);
        return plan;
    }

    async planStatus(planId: string, status: boolean): Promise<ISubscriptionPlan | null> {
        const plan = await this.findByIdAndUpdate(planId, { isActive: status });
        return plan;
    }

    //----------------------------- Coupon -----------------------------

    async fetchCoupons(): Promise<ICoupon[] | null> {
        const coupons = await this.couponModel.find().sort({ createdAt: -1 });
        return coupons;
    }

    async getCouponById(couponId: string): Promise<ICoupon | null> {
        const coupon = await this.couponModel.findById(couponId);
        return coupon;
    }

    async createCoupon(couponData: Partial<ICoupon>): Promise<ICoupon | null> {
        const newCoupon = await this.couponModel.create(couponData);
        return newCoupon;
    }

    async updateCoupon(couponId: string, couponData: Partial<ICoupon>): Promise<ICoupon | null> {
        const updatePlan = await this.couponModel.findByIdAndUpdate(couponId, { ...couponData }, { new: true });
        return updatePlan;
    }

    async deleteCoupon(couponId: string): Promise<ICoupon | null> {
        const coupon = await this.couponModel.findByIdAndDelete(couponId);
        return coupon;
    }

    async couponStatus(couponId: string, status: boolean): Promise<ICoupon | null> {
        const coupon = await this.couponModel.findByIdAndUpdate(couponId, { isActive: status }, { new: true });
        return coupon;
    }
}

export default SubscriptionRepository;