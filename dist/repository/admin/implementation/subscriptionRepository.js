"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const couponSchema_1 = require("../../../model/admin/couponSchema");
const subscriptionSchema_1 = require("../../../model/admin/subscriptionSchema");
const baseRepository_1 = require("../../base/implementation/baseRepository");
class SubscriptionRepository extends baseRepository_1.BaseRepository {
    couponModel = couponSchema_1.Coupon;
    constructor() {
        super(subscriptionSchema_1.SubscriptionPlan);
    }
    //------------------------- Subscription -------------------------
    async fetchPlans() {
        const plans = await this.model.find().sort({ createdAt: -1 });
        return plans;
    }
    async getPlanById(planId) {
        return await this.findById(planId);
    }
    async createPlan(planData) {
        return await this.create(planData);
    }
    async updatePlan(planId, planData) {
        const updatePlan = await this.findByIdAndUpdate(planId, { ...planData });
        return updatePlan;
    }
    async deletePlan(planId) {
        const plan = await this.delete(planId);
        return plan;
    }
    async planStatus(planId, status) {
        const plan = await this.findByIdAndUpdate(planId, { isActive: status });
        return plan;
    }
    //----------------------------- Coupon -----------------------------
    async fetchCoupons() {
        const coupons = await this.couponModel.find().sort({ createdAt: -1 });
        return coupons;
    }
    async getCouponById(couponId) {
        const coupon = await this.couponModel.findById(couponId);
        return coupon;
    }
    async createCoupon(couponData) {
        const newCoupon = await this.couponModel.create(couponData);
        return newCoupon;
    }
    async updateCoupon(couponId, couponData) {
        const updatePlan = await this.couponModel.findByIdAndUpdate(couponId, { ...couponData }, { new: true });
        return updatePlan;
    }
    async deleteCoupon(couponId) {
        const coupon = await this.couponModel.findByIdAndDelete(couponId);
        return coupon;
    }
    async couponStatus(couponId, status) {
        const coupon = await this.couponModel.findByIdAndUpdate(couponId, { isActive: status }, { new: true });
        return coupon;
    }
}
exports.default = SubscriptionRepository;
//# sourceMappingURL=subscriptionRepository.js.map