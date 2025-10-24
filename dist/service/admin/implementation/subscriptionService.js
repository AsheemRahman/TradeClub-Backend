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
class SubscriptionService {
    constructor(subscriptionRepository) {
        this._subscriptionRepository = subscriptionRepository;
    }
    //--------------------------- Subscription ---------------------------
    fetchPlans() {
        return __awaiter(this, void 0, void 0, function* () {
            const planData = yield this._subscriptionRepository.fetchPlans();
            return planData;
        });
    }
    getPlanById(planId) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield this._subscriptionRepository.getPlanById(planId);
            return plan;
        });
    }
    createPlan(planData) {
        return __awaiter(this, void 0, void 0, function* () {
            const Data = yield this._subscriptionRepository.createPlan(planData);
            return Data;
        });
    }
    updatePlan(planId, planData) {
        return __awaiter(this, void 0, void 0, function* () {
            const Data = yield this._subscriptionRepository.updatePlan(planId, planData);
            return Data;
        });
    }
    deletePlan(planId) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield this._subscriptionRepository.deletePlan(planId);
            return plan;
        });
    }
    planStatus(planId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield this._subscriptionRepository.planStatus(planId, status);
            return plan;
        });
    }
    //--------------------------- Subscription ---------------------------
    fetchCoupons() {
        return __awaiter(this, void 0, void 0, function* () {
            const coupons = yield this._subscriptionRepository.fetchCoupons();
            return coupons;
        });
    }
    getCouponById(couponId) {
        return __awaiter(this, void 0, void 0, function* () {
            const couponData = yield this._subscriptionRepository.getCouponById(couponId);
            return couponData;
        });
    }
    createCoupon(couponData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCoupon = yield this._subscriptionRepository.createCoupon(couponData);
            return newCoupon;
        });
    }
    updateCoupon(couponId, couponData) {
        return __awaiter(this, void 0, void 0, function* () {
            const coupon = yield this._subscriptionRepository.updateCoupon(couponId, couponData);
            return coupon;
        });
    }
    deleteCoupon(couponId) {
        return __awaiter(this, void 0, void 0, function* () {
            const coupon = yield this._subscriptionRepository.deleteCoupon(couponId);
            return coupon;
        });
    }
    CouponStatus(couponId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const coupon = yield this._subscriptionRepository.couponStatus(couponId, status);
            return coupon;
        });
    }
}
exports.default = SubscriptionService;
