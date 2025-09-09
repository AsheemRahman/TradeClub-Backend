import { ICoupon } from "../../model/admin/couponSchema";
import { ISubscriptionPlan } from "../../model/admin/subscriptionSchema";


interface ISubscriptionRepository {

    //-------------------- Subscription --------------------

    fetchPlans(): Promise<ISubscriptionPlan[] | null>;
    getPlanById(planId: string): Promise<ISubscriptionPlan | null>;
    createPlan(planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null>;
    updatePlan(planId: string, planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null>;
    deletePlan(planId: string): Promise<ISubscriptionPlan | null>;
    planStatus(planId: string, status: boolean): Promise<ISubscriptionPlan | null>;

    //----------------------- Coupon -----------------------

    fetchCoupons(): Promise<ICoupon[] | null>;
    getCouponById(couponId: string): Promise<ICoupon | null>;
    createCoupon(couponData: Partial<ICoupon>): Promise<ICoupon | null>;
    updateCoupon(couponId: string, couponData: Partial<ICoupon>): Promise<ICoupon | null>;
    deleteCoupon(couponId: string): Promise<ICoupon | null>;
    couponStatus(couponId: string, status: boolean): Promise<ICoupon | null>;
}

export default ISubscriptionRepository;