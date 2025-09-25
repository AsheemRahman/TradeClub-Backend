import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../../../constants/message";
import { STATUS_CODES } from "../../../constants/statusCode";

import ISubscriptionController from "../ISubscriptionController";
import ISubscriptionService from "../../../service/admin/ISubscriptionService";
import { ISubscriptionPlan } from "../../../model/admin/subscriptionSchema";
import { ICoupon } from "../../../model/admin/couponSchema";
import { asyncHandler } from "../../../utils/asyncHandler";


class SubscriptionController implements ISubscriptionController {

    private _subscriptionService: ISubscriptionService;

    constructor(SubscriptionService: ISubscriptionService) {
        this._subscriptionService = SubscriptionService;
    }

    fetchPlans = asyncHandler(async (req: Request, res: Response) => {
        const planData = await this._subscriptionService.fetchPlans();
        res.status(STATUS_CODES.OK).json({
            status: true,
            message: "Subscription plan fetched successfully",
            planData,
        });
    });

    getPlanById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const subscription = await this._subscriptionService.getPlanById(id);
        if (!subscription) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        res.status(STATUS_CODES.OK).json({
            status: true,
            message: "Subscription fetched successfully",
            subscription,
        });
    });


    createPlan = asyncHandler(async (req: Request, res: Response) => {
        const { name, price, duration, features, accessLevel, isActive } = req.body;
        if (!name || !price || !duration || !features || !accessLevel) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const planData = await this._subscriptionService.createPlan({
            name,
            price,
            duration,
            features,
            accessLevel,
            isActive,
        } as ISubscriptionPlan);
        res.status(STATUS_CODES.CREATED).json({
            status: true,
            message: "Subscription plan created successfully",
            planData,
        });
    });

    updatePlan = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
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
    });

    deletePlan = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        const checkPlan = await this._subscriptionService.getPlanById(id);
        if (!checkPlan) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return
        }
        const plan = await this._subscriptionService.deletePlan(id);
        res.status(STATUS_CODES.CREATED).json({ status: true, message: "Subscription plan Deleted Successfully", plan })
    });

    planStatus = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        const checkPlan = await this._subscriptionService.getPlanById(id);
        if (!checkPlan) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return
        }
        const plan = await this._subscriptionService.planStatus(id, !checkPlan.isActive);
        res.status(STATUS_CODES.CREATED).json({ status: true, message: "Plan Status change Successfully", plan })
    });

    //---------------------------- Coupon Management ----------------------------

    fetchCoupons = asyncHandler(async (req: Request, res: Response) => {
        const coupons = await this._subscriptionService.fetchCoupons();
        res.status(STATUS_CODES.OK).json({ status: true, message: "Coupons Fetched Successfully", coupons })
    });

    createCoupon = asyncHandler(async (req: Request, res: Response) => {
        const { code, description, discountType, discountValue, minPurchaseAmount, usageLimit, expiresAt, isActive, target, applicableToUsers } = req.body;
        if (!code || !discountType || !discountValue || !expiresAt) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.MISSING_REQUIRED_FIELDS || "Required fields are missing." });
            return;
        }
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
    });

    updateCoupon = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND });
            return;
        }
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
    });

    deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        const checkCoupon = await this._subscriptionService.getCouponById(id);
        if (!checkCoupon) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return
        }
        const plan = await this._subscriptionService.deleteCoupon(id);
        res.status(STATUS_CODES.CREATED).json({ status: true, message: "Coupon Deleted Successfully", plan })
    });

    couponStatus = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        const checkCoupon = await this._subscriptionService.getCouponById(id);
        if (!checkCoupon) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return
        }
        const coupon = await this._subscriptionService.planStatus(id, !checkCoupon.isActive);
        res.status(STATUS_CODES.OK).json({ status: true, message: "Plan Status change Successfully", coupon })
    });

}

export default SubscriptionController;