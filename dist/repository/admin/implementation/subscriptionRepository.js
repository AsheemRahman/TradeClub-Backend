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
const couponSchema_1 = require("../../../model/admin/couponSchema");
const subscriptionSchema_1 = require("../../../model/admin/subscriptionSchema");
const baseRepository_1 = require("../../base/implementation/baseRepository");
class SubscriptionRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(subscriptionSchema_1.SubscriptionPlan);
        this.couponModel = couponSchema_1.Coupon;
    }
    //------------------------- Subscription -------------------------
    fetchPlans() {
        return __awaiter(this, void 0, void 0, function* () {
            const plans = yield this.model.find().sort({ createdAt: -1 });
            return plans;
        });
    }
    getPlanById(planId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findById(planId);
        });
    }
    createPlan(planData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.create(planData);
        });
    }
    updatePlan(planId, planData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatePlan = yield this.findByIdAndUpdate(planId, Object.assign({}, planData));
            return updatePlan;
        });
    }
    deletePlan(planId) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield this.delete(planId);
            return plan;
        });
    }
    planStatus(planId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield this.findByIdAndUpdate(planId, { isActive: status });
            return plan;
        });
    }
    //----------------------------- Coupon -----------------------------
    fetchCoupons() {
        return __awaiter(this, void 0, void 0, function* () {
            const coupons = yield this.couponModel.find().sort({ createdAt: -1 });
            return coupons;
        });
    }
    getCouponById(couponId) {
        return __awaiter(this, void 0, void 0, function* () {
            const coupon = yield this.couponModel.findById(couponId);
            return coupon;
        });
    }
    createCoupon(couponData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCoupon = yield this.couponModel.create(couponData);
            return newCoupon;
        });
    }
    updateCoupon(couponId, couponData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatePlan = yield this.couponModel.findByIdAndUpdate(couponId, Object.assign({}, couponData), { new: true });
            return updatePlan;
        });
    }
    deleteCoupon(couponId) {
        return __awaiter(this, void 0, void 0, function* () {
            const coupon = yield this.couponModel.findByIdAndDelete(couponId);
            return coupon;
        });
    }
    couponStatus(couponId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const coupon = yield this.couponModel.findByIdAndUpdate(couponId, { isActive: status }, { new: true });
            return coupon;
        });
    }
}
exports.default = SubscriptionRepository;
