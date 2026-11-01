"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SubscriptionService {
    _subscriptionRepository;
    constructor(subscriptionRepository) {
        this._subscriptionRepository = subscriptionRepository;
    }
    //--------------------------- Subscription ---------------------------
    async fetchPlans() {
        const planData = await this._subscriptionRepository.fetchPlans();
        return planData;
    }
    async getPlanById(planId) {
        const plan = await this._subscriptionRepository.getPlanById(planId);
        return plan;
    }
    async createPlan(planData) {
        const Data = await this._subscriptionRepository.createPlan(planData);
        return Data;
    }
    async updatePlan(planId, planData) {
        const Data = await this._subscriptionRepository.updatePlan(planId, planData);
        return Data;
    }
    async deletePlan(planId) {
        const plan = await this._subscriptionRepository.deletePlan(planId);
        return plan;
    }
    async planStatus(planId, status) {
        const plan = await this._subscriptionRepository.planStatus(planId, status);
        return plan;
    }
    //--------------------------- Subscription ---------------------------
    async fetchCoupons() {
        const coupons = await this._subscriptionRepository.fetchCoupons();
        return coupons;
    }
    async getCouponById(couponId) {
        const couponData = await this._subscriptionRepository.getCouponById(couponId);
        return couponData;
    }
    async createCoupon(couponData) {
        const newCoupon = await this._subscriptionRepository.createCoupon(couponData);
        return newCoupon;
    }
    async updateCoupon(couponId, couponData) {
        const coupon = await this._subscriptionRepository.updateCoupon(couponId, couponData);
        return coupon;
    }
    async deleteCoupon(couponId) {
        const coupon = await this._subscriptionRepository.deleteCoupon(couponId);
        return coupon;
    }
    async CouponStatus(couponId, status) {
        const coupon = await this._subscriptionRepository.couponStatus(couponId, status);
        return coupon;
    }
}
exports.default = SubscriptionService;
//# sourceMappingURL=subscriptionService.js.map