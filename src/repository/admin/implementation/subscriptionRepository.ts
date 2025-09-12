import { Coupon, ICoupon } from "../../../model/admin/couponSchema";
import { SubscriptionPlan, ISubscriptionPlan } from "../../../model/admin/subscriptionSchema";
import ISubscriptionRepository from "../ISubscriptionRepository";


class SubscriptionRepository implements ISubscriptionRepository {

    //------------------------- Subscription -------------------------

    async fetchPlans(): Promise<ISubscriptionPlan[] | null> {
        const plans = await SubscriptionPlan.find().sort({ createdAt: -1 });
        return plans;
    }

    async getPlanById(planId: string): Promise<ISubscriptionPlan | null> {
        const plan = await SubscriptionPlan.findById(planId);
        return plan;
    }

    async createPlan(planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null> {
        const newPlan = await SubscriptionPlan.create(planData);
        return newPlan;
    }

    async updatePlan(planId: string, planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null> {
        const updatePlan = await SubscriptionPlan.findByIdAndUpdate(planId, { ...planData }, { new: true });
        return updatePlan;
    }

    async deletePlan(planId: string): Promise<ISubscriptionPlan | null> {
        const plan = await SubscriptionPlan.findByIdAndDelete(planId);
        return plan;
    }

    async planStatus(planId: string, status: boolean): Promise<ISubscriptionPlan | null> {
        const plan = await SubscriptionPlan.findByIdAndUpdate(planId, { isActive: status }, { new: true });
        return plan;
    }

    //----------------------------- Coupon -----------------------------

    async fetchCoupons(): Promise<ICoupon[] | null> {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        return coupons;
    }

    async getCouponById(couponId: string): Promise<ICoupon | null> {
        const coupon = await Coupon.findById(couponId);
        return coupon;
    }

    async createCoupon(couponData: Partial<ICoupon>): Promise<ICoupon | null> {
        const newCoupon = await Coupon.create(couponData);
        return newCoupon;
    }

    async updateCoupon(couponId: string, couponData: Partial<ICoupon>): Promise<ICoupon | null> {
        const updatePlan = await Coupon.findByIdAndUpdate(couponId, { ...couponData }, { new: true });
        return updatePlan;
    }

    async deleteCoupon(couponId: string): Promise<ICoupon | null> {
        const coupon = await Coupon.findByIdAndDelete(couponId);
        return coupon;
    }

    async couponStatus(couponId: string, status: boolean): Promise<ICoupon | null> {
        const coupon = await Coupon.findByIdAndUpdate(couponId, { isActive: status }, { new: true });
        return coupon;
    }
}

export default SubscriptionRepository;