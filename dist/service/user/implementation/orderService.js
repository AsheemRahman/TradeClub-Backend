"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class OrderService {
    _orderRepository;
    _courseRepository;
    _earningRepository;
    constructor(orderRepository, courseRepository, earingRepository) {
        this._orderRepository = orderRepository;
        this._courseRepository = courseRepository;
        this._earningRepository = earingRepository;
    }
    ;
    async getCourseById(courseId) {
        const Course = await this._courseRepository.getCourseById(courseId);
        return Course;
    }
    async updateCourse(courseId, purchasedUsers) {
        const Courses = await this._courseRepository.updateCourse(courseId, purchasedUsers);
        return Courses;
    }
    async getCourseByUser(userId) {
        const Courses = await this._courseRepository.getCourseByUser(userId);
        return Courses;
    }
    async getProgressByUser(userId) {
        const Courses = await this._courseRepository.getAllProgress(userId);
        return Courses;
    }
    async createOrder(order) {
        const newOrder = await this._orderRepository.createOrder(order);
        return newOrder;
    }
    async getOrderById(orderId) {
        const Course = await this._orderRepository.getOrderById(orderId);
        return Course;
    }
    async checkOrderExisting(orderId) {
        const order = await this._orderRepository.checkOrderExisting(orderId);
        return order;
    }
    async getPurchasedByUser(userId, courseId) {
        const order = await this._orderRepository.getPurchasedByUser(userId, courseId);
        return order;
    }
    async getPlanById(planId) {
        const planData = await this._orderRepository.getPlanById(planId);
        return planData;
    }
    async checkPlan(userId, planId) {
        const Data = await this._orderRepository.checkPlan(userId, planId);
        return Data;
    }
    async createUserSubscription(userId, planId, paymentId, paymentStatus, callsRemaining, durationInDays = 30, autoRenew = false) {
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + durationInDays);
        await this._orderRepository.deactivateSubscription(userId);
        return await this._orderRepository.createSubscription({
            user: userId, subscriptionPlan: planId, startDate, endDate, isActive: true,
            paymentId, paymentStatus, autoRenew, callsRemaining
        });
    }
    async updateUserSubscription(subscriptionId, updateData) {
        return await this._orderRepository.updateUserSubscription(subscriptionId, updateData);
    }
    async getActiveSubscription(userId) {
        return await this._orderRepository.findActiveSubscription(userId);
    }
    async getAllSubscriptionsByUser(userId) {
        return await this._orderRepository.getAllSubscriptionsByUser(userId);
    }
    async updateSubscription(userId, planId) {
        return await this._orderRepository.updateSubscription(userId, planId);
    }
    async createSession(data) {
        return await this._orderRepository.createSession(data);
    }
    async checkSessionAvailable(expertId, availabilityId) {
        return await this._orderRepository.checkSessionAvailable(expertId, availabilityId);
    }
    async getUserSessions(userId) {
        return await this._orderRepository.getSessionsByUser(userId);
    }
    async markSessionStatus(sessionId, status) {
        const session = await this._orderRepository.updateSessionStatus(sessionId, status);
        if (!session)
            return null;
        if (status === 'completed' && session.expertId) {
            const sessionObjectId = session._id;
            await this._earningRepository.createEarning({
                expertId: session?.expertId,
                sessionId: new mongoose_1.default.Types.ObjectId(sessionObjectId),
                amount: 100,
                status: "pending"
            });
        }
        return session;
    }
    async cancelStatus(sessionId) {
        const session = await this._orderRepository.cancelSession(sessionId);
        return session;
    }
    async availabityStatus(availabilityId) {
        const availavility = await this._orderRepository.availabityStatus(availabilityId);
        return availavility;
    }
    async callCountAdd(availabilityId) {
        const subscription = await this._orderRepository.callCountAdd(availabilityId);
        return subscription;
    }
}
exports.default = OrderService;
//# sourceMappingURL=orderService.js.map