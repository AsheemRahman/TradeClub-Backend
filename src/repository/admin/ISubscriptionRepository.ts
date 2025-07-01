import { ICoupon } from "../../model/admin/couponSchema";
import { ISubscriptionPlan } from "../../model/admin/subscriptionSchema";


interface ISubscriptionRepository {

    //-------------------- Subscription --------------------

    fetchPlans(): Promise<ISubscriptionPlan[] | null>;
    getPlanById(id: string): Promise<ISubscriptionPlan | null>;
    createPlan(planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null>;
    updatePlan(id: string, planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null>;
    deletePlan(id: string): Promise<ISubscriptionPlan | null>;
    planStatus(id: string, status: boolean): Promise<ISubscriptionPlan | null>;

    //----------------------- Coupon -----------------------

    fetchCoupons(): Promise<ICoupon[] | null>;
    getCouponById(id: string): Promise<ICoupon | null>;
    createCoupon(couponData: Partial<ICoupon>): Promise<ICoupon | null>;
    updateCoupon(id: string, couponData: Partial<ICoupon>): Promise<ICoupon | null>;
    deleteCoupon(id: string): Promise<ICoupon | null>;
    couponStatus(id: string, status: boolean): Promise<ICoupon | null>;
}

export default ISubscriptionRepository;