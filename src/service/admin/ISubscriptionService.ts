import { ISubscriptionPlan } from "../../model/admin/subscriptionSchema";
import { ICoupon } from "../../model/admin/couponSchema";


interface ISubscriptionService {

    //----------------------- Subscription -----------------------
    
    fetchPlans(): Promise<ISubscriptionPlan[] | null>;
    getPlanById(planId: string): Promise<ISubscriptionPlan | null>;
    createPlan(planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null>;
    updatePlan(planId: string, planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null>;
    deletePlan(planId: string): Promise<ISubscriptionPlan | null>;
    planStatus(planId: string, status: boolean): Promise<ISubscriptionPlan | null>;

    //----------------------- Subscription -----------------------

    fetchCoupons(): Promise<ICoupon[] | null>;
    getCouponById(couponId: string): Promise<ICoupon | null>;
    createCoupon(couponData: Partial<ICoupon>): Promise<ICoupon | null>;
    updateCoupon(couponId: string, couponData: Partial<ICoupon>): Promise<ICoupon | null>;
    deleteCoupon(couponId: string): Promise<ICoupon | null>;
    CouponStatus(couponId: string, status: boolean): Promise<ICoupon | null>;
}

export default ISubscriptionService;