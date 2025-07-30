import { Request, Response } from "express"

interface ISubscriptionController {

    //-------------------- Subscription --------------------

    fetchPlans(req: Request, res: Response): Promise<void>;
    getPlanById(req: Request, res: Response): Promise<void>;
    createPlan(req: Request, res: Response): Promise<void>;
    updatePlan(req: Request, res: Response): Promise<void>;
    deletePlan(req: Request, res: Response): Promise<void>;
    planStatus(req: Request, res: Response): Promise<void>;

    //----------------------- Coupon -----------------------

    fetchCoupons(req: Request, res: Response): Promise<void>;
    createCoupon(req: Request, res: Response): Promise<void>;
    updateCoupon(req: Request, res: Response): Promise<void>;
    deleteCoupon(req: Request, res: Response): Promise<void>;
    couponStatus(req: Request, res: Response): Promise<void>;
}

export default ISubscriptionController;