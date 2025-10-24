"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorMessage_1 = require("../../../constants/errorMessage");
const statusCode_1 = require("../../../constants/statusCode");
const asyncHandler_1 = require("../../../utils/asyncHandler");
const successMessage_1 = require("../../../constants/successMessage");
class SubscriptionController {
    constructor(SubscriptionService) {
        this.fetchPlans = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const planData = yield this._subscriptionService.fetchPlans();
            res.status(statusCode_1.STATUS_CODES.OK).json({
                status: true,
                message: successMessage_1.SUCCESS_MESSAGES.SUBSCRIPTION_FETCH,
                planData,
            });
        }));
        this.getPlanById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const subscription = yield this._subscriptionService.getPlanById(id);
            if (!subscription) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            res.status(statusCode_1.STATUS_CODES.OK).json({
                status: true,
                message: successMessage_1.SUCCESS_MESSAGES.SUBSCRIPTION_FETCH,
                subscription,
            });
        }));
        this.createPlan = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name, price, duration, features, accessLevel, isActive } = req.body;
            if (!name || !price || !duration || !features || !accessLevel) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const planData = yield this._subscriptionService.createPlan({
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
        }));
        this.updatePlan = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
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
            const checkPlan = yield this._subscriptionService.getPlanById(id);
            if (!checkPlan) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const planData = yield this._subscriptionService.updatePlan(id, { name, price, duration, features, accessLevel, isActive });
            res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Subscription plan updated Successfully", planData });
        }));
        this.deletePlan = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const checkPlan = yield this._subscriptionService.getPlanById(id);
            if (!checkPlan) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const plan = yield this._subscriptionService.deletePlan(id);
            res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Subscription plan Deleted Successfully", plan });
        }));
        this.planStatus = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const checkPlan = yield this._subscriptionService.getPlanById(id);
            if (!checkPlan) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const plan = yield this._subscriptionService.planStatus(id, !checkPlan.isActive);
            res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Plan Status change Successfully", plan });
        }));
        //---------------------------- Coupon Management ----------------------------
        this.fetchCoupons = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const coupons = yield this._subscriptionService.fetchCoupons();
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Coupons Fetched Successfully", coupons });
        }));
        this.createCoupon = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
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
            const coupon = yield this._subscriptionService.createCoupon(couponData);
            res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Coupon created successfully", coupon });
        }));
        this.updateCoupon = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
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
            const existingCoupon = yield this._subscriptionService.getCouponById(id);
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
            const coupon = yield this._subscriptionService.updateCoupon(id, updatedCouponData);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Coupon updated successfully.", coupon });
        }));
        this.deleteCoupon = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const checkCoupon = yield this._subscriptionService.getCouponById(id);
            if (!checkCoupon) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const plan = yield this._subscriptionService.deleteCoupon(id);
            res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Coupon Deleted Successfully", plan });
        }));
        this.couponStatus = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const checkCoupon = yield this._subscriptionService.getCouponById(id);
            if (!checkCoupon) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const coupon = yield this._subscriptionService.planStatus(id, !checkCoupon.isActive);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Plan Status change Successfully", coupon });
        }));
        this._subscriptionService = SubscriptionService;
    }
}
exports.default = SubscriptionController;
