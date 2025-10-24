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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class OrderService {
    constructor(orderRepository, courseRepository, earingRepository) {
        this._orderRepository = orderRepository;
        this._courseRepository = courseRepository;
        this._earningRepository = earingRepository;
    }
    ;
    getCourseById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const Course = yield this._courseRepository.getCourseById(courseId);
            return Course;
        });
    }
    updateCourse(courseId, purchasedUsers) {
        return __awaiter(this, void 0, void 0, function* () {
            const Courses = yield this._courseRepository.updateCourse(courseId, purchasedUsers);
            return Courses;
        });
    }
    getCourseByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const Courses = yield this._courseRepository.getCourseByUser(userId);
            return Courses;
        });
    }
    getProgressByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const Courses = yield this._courseRepository.getAllProgress(userId);
            return Courses;
        });
    }
    createOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            const newOrder = yield this._orderRepository.createOrder(order);
            return newOrder;
        });
    }
    getOrderById(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const Course = yield this._orderRepository.getOrderById(orderId);
            return Course;
        });
    }
    checkOrderExisting(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this._orderRepository.checkOrderExisting(orderId);
            return order;
        });
    }
    getPurchasedByUser(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this._orderRepository.getPurchasedByUser(userId, courseId);
            return order;
        });
    }
    getPlanById(planId) {
        return __awaiter(this, void 0, void 0, function* () {
            const planData = yield this._orderRepository.getPlanById(planId);
            return planData;
        });
    }
    checkPlan(userId, planId) {
        return __awaiter(this, void 0, void 0, function* () {
            const Data = yield this._orderRepository.checkPlan(userId, planId);
            return Data;
        });
    }
    createUserSubscription(userId_1, planId_1, paymentId_1, paymentStatus_1, callsRemaining_1) {
        return __awaiter(this, arguments, void 0, function* (userId, planId, paymentId, paymentStatus, callsRemaining, durationInDays = 30, autoRenew = false) {
            const startDate = new Date();
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + durationInDays);
            yield this._orderRepository.deactivateSubscription(userId);
            return yield this._orderRepository.createSubscription({
                user: userId, subscriptionPlan: planId, startDate, endDate, isActive: true,
                paymentId, paymentStatus, autoRenew, callsRemaining
            });
        });
    }
    updateUserSubscription(subscriptionId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._orderRepository.updateUserSubscription(subscriptionId, updateData);
        });
    }
    getActiveSubscription(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._orderRepository.findActiveSubscription(userId);
        });
    }
    getAllSubscriptionsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._orderRepository.getAllSubscriptionsByUser(userId);
        });
    }
    updateSubscription(userId, planId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._orderRepository.updateSubscription(userId, planId);
        });
    }
    createSession(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._orderRepository.createSession(data);
        });
    }
    checkSessionAvailable(expertId, availabilityId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._orderRepository.checkSessionAvailable(expertId, availabilityId);
        });
    }
    getUserSessions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._orderRepository.getSessionsByUser(userId);
        });
    }
    markSessionStatus(sessionId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this._orderRepository.updateSessionStatus(sessionId, status);
            if (!session)
                return null;
            if (status === 'completed' && session.expertId) {
                const sessionObjectId = session._id;
                yield this._earningRepository.createEarning({
                    expertId: session === null || session === void 0 ? void 0 : session.expertId,
                    sessionId: new mongoose_1.default.Types.ObjectId(sessionObjectId),
                    amount: 100,
                    status: "pending"
                });
            }
            return session;
        });
    }
    cancelStatus(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this._orderRepository.cancelSession(sessionId);
            return session;
        });
    }
    availabityStatus(availabilityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const availavility = yield this._orderRepository.availabityStatus(availabilityId);
            return availavility;
        });
    }
    callCountAdd(availabilityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscription = yield this._orderRepository.callCountAdd(availabilityId);
            return subscription;
        });
    }
}
exports.default = OrderService;
