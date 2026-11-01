"use strict";
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
    async createOrder(order) {
        const formattedOrder = { ...order, userId: new mongoose_1.default.Types.ObjectId(order.userId), itemId: new mongoose_1.default.Types.ObjectId(order.itemId), };
        return await this.create(formattedOrder);
    }
    ;
    async getOrderById(userId) {
        const orders = await this.model.find({ userId }).sort({ createdAt: -1 });
        return orders;
    }
    ;
    async checkOrderExisting(orderId) {
        const order = await this.model.findOne({ stripeSessionId: orderId });
        return order;
    }
    ;
    async getPurchasedByUser(userId, courseId) {
        const order = await this.model.findOne({ userId, itemId: courseId }).lean();
        return order;
    }
    ;
    async getPlanById(planId) {
        const planData = await subscriptionSchema_1.SubscriptionPlan.findById(planId);
        return planData;
    }
    async checkPlan(userId, planId) {
        const Data = await userSubscriptionSchema_1.UserSubscription.find({ user: userId, subscriptionPlan: planId, isActive: true, });
        return Data;
    }
    async createSubscription(data) {
        return await userSubscriptionSchema_1.UserSubscription.create(data);
    }
    async updateUserSubscription(subscriptionId, updateData) {
        const { callsRemaining, ...rest } = updateData;
        const updateQuery = { $set: rest };
        if (callsRemaining) {
            updateQuery.$inc = { callsRemaining: callsRemaining };
        }
        return await userSubscriptionSchema_1.UserSubscription.findByIdAndUpdate(subscriptionId, updateQuery, { new: true });
    }
    async findActiveSubscription(userId) {
        return await userSubscriptionSchema_1.UserSubscription.findOne({ user: userId, isActive: true, endDate: { $gt: new Date() }, });
    }
    async findByUserAndPlan(userId, planId) {
        return await userSubscriptionSchema_1.UserSubscription.findOne({ user: userId, subscriptionPlan: planId, });
    }
    async deactivateSubscription(userId) {
        await userSubscriptionSchema_1.UserSubscription.updateMany({ user: userId, isActive: true }, { $set: { isActive: false } });
    }
    async getAllSubscriptionsByUser(userId) {
        return await userSubscriptionSchema_1.UserSubscription.find({ user: userId });
    }
    async updateSubscription(userId, planId) {
        const res = await userSubscriptionSchema_1.UserSubscription.findOneAndUpdate({
            user: userId,
            subscriptionPlan: planId,
            isActive: true,
            endDate: { $gt: new Date() },
            callsRemaining: { $gt: 0 }
        }, { $inc: { callsRemaining: -1 } }, { new: true });
        return res;
    }
    async createSession(data) {
        const availability = await availabilitySchema_1.ExpertAvailability.findOneAndUpdate({ _id: data.availabilityId, isBooked: false }, { isBooked: true }, { new: true });
        if (!availability) {
            throw new Error('Expert Availability not found');
        }
        return await sessionSchema_1.Session.create({ ...data, status: 'upcoming', bookedAt: availability.date, startTime: availability.startTime, endTime: availability.endTime });
    }
    async checkSessionAvailable(expertId, availabilityId) {
        return await sessionSchema_1.Session.findOne({ expertId, availabilityId });
    }
    async getSessionsByUser(userId) {
        return await sessionSchema_1.Session.find({ userId }).populate('expertId availabilityId');
    }
    async updateSessionStatus(sessionId, status) {
        return await sessionSchema_1.Session.findByIdAndUpdate(sessionId, { status }, { new: true });
    }
    async cancelSession(sessionId) {
        return await sessionSchema_1.Session.findByIdAndUpdate(sessionId, { status: "canceled" }, { new: true });
    }
    async availabityStatus(availabilityId) {
        return await availabilitySchema_1.ExpertAvailability.findByIdAndUpdate(availabilityId, { isBooked: false }, { new: true });
    }
    async callCountAdd(userSubscriptionID) {
        return await userSubscriptionSchema_1.UserSubscription.findOneAndUpdate({
            _id: userSubscriptionID,
            isActive: true,
            endDate: { $gt: new Date() },
        }, { $inc: { callsRemaining: 1 } }, { new: true });
    }
}
exports.default = OrderRepository;
//# sourceMappingURL=orderRepository.js.map