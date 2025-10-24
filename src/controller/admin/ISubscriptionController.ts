import { NextFunction, Request, Response } from "express"

type ControllerMethod = (req: Request, res: Response, next: NextFunction) => Promise<void>;


interface ISubscriptionController {

    //-------------------- Subscription --------------------

    fetchPlans: ControllerMethod;
    getPlanById: ControllerMethod;
    createPlan: ControllerMethod;
    updatePlan: ControllerMethod;
    deletePlan: ControllerMethod;
    planStatus: ControllerMethod;

    //----------------------- Coupon -----------------------

    fetchCoupons: ControllerMethod;
    createCoupon: ControllerMethod;
    updateCoupon: ControllerMethod;
    deleteCoupon: ControllerMethod;
    couponStatus: ControllerMethod;
}

export default ISubscriptionController;