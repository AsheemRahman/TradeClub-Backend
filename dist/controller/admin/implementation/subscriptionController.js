"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMessage_1 = require("../../../constants/errorMessage");
const statusCode_1 = require("../../../constants/statusCode");
const asyncHandler_1 = require("../../../utils/asyncHandler");
const successMessage_1 = require("../../../constants/successMessage");
class SubscriptionController {
    _subscriptionService;
    constructor(SubscriptionService) {
        this._subscriptionService = SubscriptionService;
    }
    fetchPlans = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const planData = await this._subscriptionService.fetchPlans();
        res.status(statusCode_1.STATUS_CODES.OK).json({
            status: true,
            message: successMessage_1.SUCCESS_MESSAGES.SUBSCRIPTION_FETCH,
            planData,
        });
    });
    getPlanById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const subscription = await this._subscriptionService.getPlanById(id);
        if (!subscription) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        res.status(statusCode_1.STATUS_CODES.OK).json({
            status: true,
            message: successMessage_1.SUCCESS_MESSAGES.SUBSCRIPTION_FETCH,
            subscription,
        });
    });
    createPlan = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { name, price, duration, features, accessLevel, isActive } = req.body;
        if (!name || !price || !duration || !features || !accessLevel) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const planData = await this._subscriptionService.createPlan({
            name,
            price,
            duration,
            features,
            accessLevel,
            isActive,
        });
        res.status(statusCode_1.STATUS_CODES.CREATED).json({
            status: true,
            message: "Subscription plan created successfully",
            planData,
        });
    });
    updatePlan = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const { name, price, duration, features, accessLevel, isActive } = req.body;
        if (!name || !price || !duration || !features || !accessLevel) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const checkPlan = await this._subscriptionService.getPlanById(id);
        if (!checkPlan) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const planData = await this._subscriptionService.updatePlan(id, { name, price, duration, features, accessLevel, isActive });
        res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Subscription plan updated Successfully", planData });
    });
    deletePlan = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const checkPlan = await this._subscriptionService.getPlanById(id);
        if (!checkPlan) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const plan = await this._subscriptionService.deletePlan(id);
        res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Subscription plan Deleted Successfully", plan });
    });
    planStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const checkPlan = await this._subscriptionService.getPlanById(id);
        if (!checkPlan) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const plan = await this._subscriptionService.planStatus(id, !checkPlan.isActive);
        res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Plan Status change Successfully", plan });
    });
    //---------------------------- Coupon Management ----------------------------
    fetchCoupons = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const coupons = await this._subscriptionService.fetchCoupons();
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Coupons Fetched Successfully", coupons });
    });
    createCoupon = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { code, description, discountType, discountValue, minPurchaseAmount, usageLimit, expiresAt, isActive, target, applicableToUsers } = req.body;
        if (!code || !discountType || !discountValue || !expiresAt) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.MISSING_REQUIRED_FIELDS || "Required fields are missing." });
            return;
        }
        const couponData = {
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
        res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Coupon created successfully", coupon });
    });
    updateCoupon = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const { code, description, discountType, discountValue, minPurchaseAmount, usageLimit, expiresAt, isActive, target, applicableToUsers } = req.body;
        if (!code || !discountType || !discountValue || !expiresAt) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.MISSING_REQUIRED_FIELDS || "Required fields are missing." });
            return;
        }
        const existingCoupon = await this._subscriptionService.getCouponById(id);
        if (!existingCoupon) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const updatedCouponData = {
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
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Coupon updated successfully.", coupon });
    });
    deleteCoupon = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const checkCoupon = await this._subscriptionService.getCouponById(id);
        if (!checkCoupon) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const plan = await this._subscriptionService.deleteCoupon(id);
        res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Coupon Deleted Successfully", plan });
    });
    couponStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const checkCoupon = await this._subscriptionService.getCouponById(id);
        if (!checkCoupon) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const coupon = await this._subscriptionService.planStatus(id, !checkCoupon.isActive);
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Plan Status change Successfully", coupon });
    });
}
exports.default = SubscriptionController;
//# sourceMappingURL=subscriptionController.js.map