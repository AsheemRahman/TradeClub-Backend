import { ISubscriptionPlan } from "../../model/admin/subscriptionSchema";
import { ICoupon } from "../../model/admin/couponSchema";


interface ISubscriptionService {

    //----------------------- Subscription -----------------------
    
    fetchPlans(): Promise<ISubscriptionPlan[] | null>;
    getPlanById(id: string): Promise<ISubscriptionPlan | null>;
    createPlan(planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null>;
    updatePlan(id: string, planData: ISubscriptionPlan): Promise<ISubscriptionPlan | null>;
    deletePlan(id: string): Promise<ISubscriptionPlan | null>;
    planStatus(id: string, status: boolean): Promise<ISubscriptionPlan | null>;

    //----------------------- Subscription -----------------------

    fetchCoupons(): Promise<ICoupon[] | null>;
    getCouponById(id: string): Promise<ICoupon | null>;
    createCoupon(couponData: Partial<ICoupon>): Promise<ICoupon | null>;
    updateCoupon(id: string, couponData: Partial<ICoupon>): Promise<ICoupon | null>;
    deleteCoupon(id: string): Promise<ICoupon | null>;
    CouponStatus(id: string, status: boolean): Promise<ICoupon | null>;
}

export default ISubscriptionService;