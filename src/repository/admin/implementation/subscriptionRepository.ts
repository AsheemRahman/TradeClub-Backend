import { Coupon, ICoupon } from "../../../model/admin/couponSchema";
import SubscriptionPlan, { ISubscriptionPlan } from "../../../model/admin/subscriptionSchema";
import ISubscriptionRepository from "../ISubscriptionRepository";


class SubscriptionRepository implements ISubscriptionRepository {

    //------------------------- Subscription -------------------------

    async fetchPlans(): Promise<ISubscriptionPlan[] | null> {
        const plans = await SubscriptionPlan.find().sort({ createdAt: -1 });
        return plans;
    }

    async getPlanById(id: string): Promise<ISubscriptionPlan | null> {
        const plan = await SubscriptionPlan.findById(id);
        return plan;
    }

    async createPlan(planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null> {
        const newPlan = await SubscriptionPlan.create(planData);
        return newPlan;
    }

    async updatePlan(id: string, planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null> {
        const updatePlan = await SubscriptionPlan.findByIdAndUpdate(id, { ...planData }, { new: true });
        return updatePlan;
    }

    async deletePlan(id: string): Promise<ISubscriptionPlan | null> {
        const plan = await SubscriptionPlan.findByIdAndDelete(id);
        return plan;
    }

    async planStatus(id: string, status: boolean): Promise<ISubscriptionPlan | null> {
        const plan = await SubscriptionPlan.findByIdAndUpdate(id, { isActive: status }, { new: true });
        return plan;
    }

    //----------------------------- Coupon -----------------------------

    async fetchCoupons(): Promise<ICoupon[] | null> {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        return coupons;
    }

    async getCouponById(id: string): Promise<ICoupon | null> {
        const coupon = await Coupon.findById(id);
        return coupon;
    }

    async createCoupon(couponData: Partial<ICoupon>): Promise<ICoupon | null> {
        const newCoupon = await Coupon.create(couponData);
        return newCoupon;
    }

    async updateCoupon(id: string, couponData: Partial<ICoupon>): Promise<ICoupon | null> {
        const updatePlan = await Coupon.findByIdAndUpdate(id, { ...couponData }, { new: true });
        return updatePlan;
    }

    async deleteCoupon(id: string): Promise<ICoupon | null> {
        const coupon = await Coupon.findByIdAndDelete(id);
        return coupon;
    }

    async couponStatus(id: string, status: boolean): Promise<ICoupon | null> {
        const coupon = await Coupon.findByIdAndUpdate(id, { isActive: status }, { new: true });
        return coupon;
    }
}

export default SubscriptionRepository;