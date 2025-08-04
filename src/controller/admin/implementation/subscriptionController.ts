import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../../../constants/message";
import { STATUS_CODES } from "../../../constants/statusCode";

import ISubscriptionController from "../ISubscriptionController";
import ISubscriptionService from "../../../service/admin/ISubscriptionService";
import { ISubscriptionPlan } from "../../../model/admin/subscriptionSchema";
import { ICoupon } from "../../../model/admin/couponSchema";


class SubscriptionController implements ISubscriptionController {

    private _subscriptionService: ISubscriptionService;

    constructor(SubscriptionService: ISubscriptionService) {
        this._subscriptionService = SubscriptionService;
    }

    async fetchPlans(req: Request, res: Response): Promise<void> {
        try {
            const planData = await this._subscriptionService.fetchPlans();
            res.status(STATUS_CODES.OK).json({ status: true, message: "Subscription plan Fetched Successfully", planData })
        } catch (error) {
            console.error("Failed to fetch Subscription plan", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to fetch Subscription plan", error: error instanceof Error ? error.message : String(error), });
        }
    };

    async getPlanById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        try {
            const subscription = await this._subscriptionService.getPlanById(id)
            if (!subscription) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
                return
            }
            res.status(STATUS_CODES.OK).json({ status: true, message: "subscription Fetched Successfully", subscription })
        } catch (error) {
            console.error("Failed to fetch subscription", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to fetch subscription", error: error instanceof Error ? error.message : String(error), });
        }
    };

    async createPlan(req: Request, res: Response): Promise<void> {
        const { name, price, duration, features, accessLevel, isActive } = req.body;
        if (!name || !price || !duration || !features || !accessLevel) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        try {
            const planData = await this._subscriptionService.createPlan({ name, price, duration, features, accessLevel, isActive } as ISubscriptionPlan);
            res.status(STATUS_CODES.CREATED).json({ status: true, message: "Subscription plan Created Successfully", planData })
        } catch (error) {
            console.error("Failed to create Subscription plan", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to create Subscription plan", error: error instanceof Error ? error.message : String(error), });
        }
    };

    async updatePlan(req: Request, res: Response): Promise<void> {
        const { id } = req.params
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        try {
            const { name, price, duration, features, accessLevel, isActive } = req.body;
            if (!name || !price || !duration || !features || !accessLevel) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
                return;
            }
            const checkPlan = await this._subscriptionService.getPlanById(id);
            if (!checkPlan) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
                return
            }
            const planData = await this._subscriptionService.updatePlan(id, { name, price, duration, features, accessLevel, isActive } as ISubscriptionPlan);
            res.status(STATUS_CODES.CREATED).json({ status: true, message: "Subscription plan updated Successfully", planData })
        } catch (error) {
            console.error("Failed to update Subscription plan", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to update Subscription plan", error: error instanceof Error ? error.message : String(error), });
        }
    };

    async deletePlan(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        try {
            const checkPlan = await this._subscriptionService.getPlanById(id);
            if (!checkPlan) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
                return
            }
            const plan = await this._subscriptionService.deletePlan(id);
            res.status(STATUS_CODES.CREATED).json({ status: true, message: "Subscription plan Deleted Successfully", plan })
        } catch (error) {
            console.error("Failed to delete Subscription plan", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to delete Subscription plan", error: error instanceof Error ? error.message : String(error), });
        }
    };

    async planStatus(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        try {
            const checkPlan = await this._subscriptionService.getPlanById(id);
            if (!checkPlan) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
                return
            }
            const plan = await this._subscriptionService.planStatus(id, !checkPlan.isActive);
            res.status(STATUS_CODES.CREATED).json({ status: true, message: "Plan Status change Successfully", plan })
        } catch (error) {
            console.error("Failed to plan status", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to change plan status", error: error instanceof Error ? error.message : String(error), });
        }
    };


    //---------------------------- Coupon Management ----------------------------

    async fetchCoupons(req: Request, res: Response): Promise<void> {
        try {
            const coupons = await this._subscriptionService.fetchCoupons();
            res.status(STATUS_CODES.OK).json({ status: true, message: "Coupons Fetched Successfully", coupons })
        } catch (error) {
            console.error("Failed to fetch Coupons", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to fetch Coupons", error: error instanceof Error ? error.message : String(error), });
        }
    };

    async createCoupon(req: Request, res: Response): Promise<void> {
        const { code, description, discountType, discountValue, minPurchaseAmount, usageLimit, expiresAt, isActive, target, applicableToUsers } = req.body;
        if (!code || !discountType || !discountValue || !expiresAt) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.MISSING_REQUIRED_FIELDS || "Required fields are missing." });
            return;
        }
        try {
            const couponData: Partial<ICoupon> = {
                code,
                description,
                discountType,
                discountValue,
                minPurchaseAmount,
                usageLimit,
                expiresAt: new Date(expiresAt),
                isActive: isActive,
                target: target || 'all',
                applicableToUsers: applicableToUsers || [],
                usedCount: 0
            };
            const coupon = await this._subscriptionService.createCoupon(couponData);
            res.status(STATUS_CODES.CREATED).json({ status: true, message: "Coupon created successfully", coupon });
        } catch (error) {
            console.error("Failed to create coupon:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to create coupon" });
        }
    };

    async updateCoupon(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        try {
            const { code, description, discountType, discountValue, minPurchaseAmount, usageLimit, expiresAt, isActive, target, applicableToUsers } = req.body;
            if (!code || !discountType || !discountValue || !expiresAt) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.MISSING_REQUIRED_FIELDS || "Required fields are missing." });
                return;
            }
            const existingCoupon = await this._subscriptionService.getCouponById(id);
            if (!existingCoupon) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const updatedCouponData: Partial<ICoupon> = {
                code,
                description,
                discountType,
                discountValue,
                minPurchaseAmount,
                usageLimit,
                expiresAt: new Date(expiresAt),
                isActive,
                target: target || 'all',
                applicableToUsers: applicableToUsers || []
            };
            const coupon = await this._subscriptionService.updateCoupon(id, updatedCouponData);
            res.status(STATUS_CODES.OK).json({ status: true, message: "Coupon updated successfully.", coupon });
        } catch (error) {
            console.error("Failed to update coupon:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to update coupon", });
        }
    }

    async deleteCoupon(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        try {
            const checkCoupon = await this._subscriptionService.getCouponById(id);
            if (!checkCoupon) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
                return
            }
            const plan = await this._subscriptionService.deleteCoupon(id);
            res.status(STATUS_CODES.CREATED).json({ status: true, message: "Coupon Deleted Successfully", plan })
        } catch (error) {
            console.error("Failed to delete Coupon", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to delete Coupon", error: error instanceof Error ? error.message : String(error), });
        }
    };

    async couponStatus(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        try {
            const checkCoupon = await this._subscriptionService.getCouponById(id);
            if (!checkCoupon) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
                return
            }
            const coupon = await this._subscriptionService.planStatus(id, !checkCoupon.isActive);
            res.status(STATUS_CODES.OK).json({ status: true, message: "Plan Status change Successfully", coupon })
        } catch (error) {
            console.error("Failed to plan status", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to change coupon status", error: error instanceof Error ? error.message : String(error), });
        }
    };

}

export default SubscriptionController;