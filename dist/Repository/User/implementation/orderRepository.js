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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const subscriptionSchema_1 = require("../../../model/admin/subscriptionSchema");
const availabilitySchema_1 = require("../../../model/expert/availabilitySchema");
const sessionSchema_1 = require("../../../model/expert/sessionSchema");
const orderSchema_1 = require("../../../model/user/orderSchema");
const userSubscriptionSchema_1 = require("../../../model/user/userSubscriptionSchema");
const baseRepository_1 = require("../../base/implementation/baseRepository");
class OrderRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(orderSchema_1.Order);
    }
    createOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            const formattedOrder = Object.assign(Object.assign({}, order), { userId: new mongoose_1.default.Types.ObjectId(order.userId), itemId: new mongoose_1.default.Types.ObjectId(order.itemId) });
            return yield this.create(formattedOrder);
        });
    }
    ;
    getOrderById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield this.model.find({ userId }).sort({ createdAt: -1 });
            return orders;
        });
    }
    ;
    checkOrderExisting(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.model.findOne({ stripeSessionId: orderId });
            return order;
        });
    }
    ;
    getPurchasedByUser(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.model.findOne({ userId, itemId: courseId }).lean();
            return order;
        });
    }
    ;
    getPlanById(planId) {
        return __awaiter(this, void 0, void 0, function* () {
            const planData = yield subscriptionSchema_1.SubscriptionPlan.findById(planId);
            return planData;
        });
    }
    checkPlan(userId, planId) {
        return __awaiter(this, void 0, void 0, function* () {
            const Data = yield userSubscriptionSchema_1.UserSubscription.find({ user: userId, subscriptionPlan: planId, isActive: true, });
            return Data;
        });
    }
    createSubscription(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userSubscriptionSchema_1.UserSubscription.create(data);
        });
    }
    updateUserSubscription(subscriptionId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { callsRemaining } = updateData, rest = __rest(updateData, ["callsRemaining"]);
            const updateQuery = { $set: rest };
            if (callsRemaining) {
                updateQuery.$inc = { callsRemaining: callsRemaining };
            }
            return yield userSubscriptionSchema_1.UserSubscription.findByIdAndUpdate(subscriptionId, updateQuery, { new: true });
        });
    }
    findActiveSubscription(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userSubscriptionSchema_1.UserSubscription.findOne({ user: userId, isActive: true, endDate: { $gt: new Date() }, });
        });
    }
    findByUserAndPlan(userId, planId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userSubscriptionSchema_1.UserSubscription.findOne({ user: userId, subscriptionPlan: planId, });
        });
    }
    deactivateSubscription(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userSubscriptionSchema_1.UserSubscription.updateMany({ user: userId, isActive: true }, { $set: { isActive: false } });
        });
    }
    getAllSubscriptionsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userSubscriptionSchema_1.UserSubscription.find({ user: userId });
        });
    }
    updateSubscription(userId, planId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield userSubscriptionSchema_1.UserSubscription.findOneAndUpdate({
                user: userId,
                subscriptionPlan: planId,
                isActive: true,
                endDate: { $gt: new Date() },
                callsRemaining: { $gt: 0 }
            }, { $inc: { callsRemaining: -1 } }, { new: true });
            return res;
        });
    }
    createSession(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const availability = yield availabilitySchema_1.ExpertAvailability.findOneAndUpdate({ _id: data.availabilityId, isBooked: false }, { isBooked: true }, { new: true });
            if (!availability) {
                throw new Error('Expert Availability not found');
            }
            return yield sessionSchema_1.Session.create(Object.assign(Object.assign({}, data), { status: 'upcoming', bookedAt: availability.date, startTime: availability.startTime, endTime: availability.endTime }));
        });
    }
    checkSessionAvailable(expertId, availabilityId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield sessionSchema_1.Session.findOne({ expertId, availabilityId });
        });
    }
    getSessionsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield sessionSchema_1.Session.find({ userId }).populate('expertId availabilityId');
        });
    }
    updateSessionStatus(sessionId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield sessionSchema_1.Session.findByIdAndUpdate(sessionId, { status }, { new: true });
        });
    }
    cancelSession(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield sessionSchema_1.Session.findByIdAndUpdate(sessionId, { status: "canceled" }, { new: true });
        });
    }
    availabityStatus(availabilityId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield availabilitySchema_1.ExpertAvailability.findByIdAndUpdate(availabilityId, { isBooked: false }, { new: true });
        });
    }
    callCountAdd(userSubscriptionID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userSubscriptionSchema_1.UserSubscription.findOneAndUpdate({
                _id: userSubscriptionID,
                isActive: true,
                endDate: { $gt: new Date() },
            }, { $inc: { callsRemaining: 1 } }, { new: true });
        });
    }
}
exports.default = OrderRepository;
