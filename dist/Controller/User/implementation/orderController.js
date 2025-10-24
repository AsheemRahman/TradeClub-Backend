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
const statusCode_1 = require("../../../constants/statusCode");
const errorMessage_1 = require("../../../constants/errorMessage");
const stripe_1 = __importDefault(require("stripe"));
const asyncHandler_1 = require("../../../utils/asyncHandler");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-06-30.basil' });
class OrderController {
    constructor(orderService) {
        this.createCheckoutSession = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { course } = req.body;
            const userId = req.userId;
            if (!course || !course.title || !course.description || !course.price || !course._id) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ message: errorMessage_1.ERROR_MESSAGES.INVALID_INPUT || "Course data is missing or incomplete.", });
                return;
            }
            if (!userId) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ message: "User authentication required.", });
                return;
            }
            if ((_a = course.purchasedUsers) === null || _a === void 0 ? void 0 : _a.some((id) => id.toString() === userId)) {
                res.status(statusCode_1.STATUS_CODES.CONFLICT).json({ message: "Already Purchased" });
                return;
            }
            const session = yield stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: [
                    {
                        price_data: {
                            currency: 'inr',
                            product_data: {
                                name: course.title,
                                description: course.description,
                                images: [course.imageUrl],
                            },
                            unit_amount: course.price * 100,
                        },
                        quantity: 1,
                    },
                ],
                success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&courseId=${course._id}`,
                cancel_url: `${process.env.CLIENT_URL}/payment-failed?session_id={CHECKOUT_SESSION_ID}&courseId=${course._id}`,
                metadata: {
                    userId: userId,
                    courseId: course._id,
                },
            });
            res.status(statusCode_1.STATUS_CODES.OK).json({ url: session.url });
            return;
        }));
        this.createOrder = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
            const { sessionId } = req.body;
            if (!sessionId) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Session ID is required" });
                return;
            }
            const session = yield stripe.checkout.sessions.retrieve(sessionId);
            if (!session || session.payment_status !== 'paid') {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: 'Payment not successful' });
                return;
            }
            const existing = yield this._orderService.checkOrderExisting(sessionId);
            if (existing) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: 'Order already exists' });
                return;
            }
            const purchaseId = ((_a = session.metadata) === null || _a === void 0 ? void 0 : _a.courseId) || ((_b = session.metadata) === null || _b === void 0 ? void 0 : _b.planId);
            const isCourse = !!((_c = session.metadata) === null || _c === void 0 ? void 0 : _c.courseId);
            const userId = (_d = session.metadata) === null || _d === void 0 ? void 0 : _d.userId;
            if (!userId || !purchaseId) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ message: errorMessage_1.ERROR_MESSAGES.UNAUTHORIZED || 'Unauthorized access', });
                return;
            }
            if (isCourse) {
                const course = yield this._orderService.getCourseById(purchaseId);
                if (!course)
                    throw new Error('Course not found');
                const order = yield this._orderService.createOrder({
                    userId,
                    itemId: purchaseId,
                    type: "Course",
                    title: course.title,
                    amount: course.price,
                    currency: ((_e = session.currency) === null || _e === void 0 ? void 0 : _e.toUpperCase()) || 'INR',
                    stripeSessionId: sessionId,
                    paymentIntentId: ((_f = session.payment_intent) === null || _f === void 0 ? void 0 : _f.toString()) || '',
                    paymentStatus: session.payment_status,
                });
                yield this._orderService.updateCourse(purchaseId, userId);
                res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Courses purchased Successfully", order });
            }
            else {
                const plan = yield this._orderService.getPlanById(purchaseId);
                if (!plan)
                    throw new Error('Subscription is not found');
                // Check if user already has an active subscription
                const existingSubscription = yield this._orderService.getActiveSubscription(userId);
                if (existingSubscription) {
                    // Update the existing subscription
                    const order = yield this._orderService.createOrder({
                        userId,
                        itemId: purchaseId,
                        type: "SubscriptionPlan",
                        title: plan.name,
                        amount: plan.price,
                        currency: ((_g = session.currency) === null || _g === void 0 ? void 0 : _g.toUpperCase()) || 'INR',
                        stripeSessionId: sessionId,
                        paymentIntentId: ((_h = session.payment_intent) === null || _h === void 0 ? void 0 : _h.toString()) || '',
                        paymentStatus: session.payment_status,
                    });
                    const updatedSubscription = yield this._orderService.updateUserSubscription(existingSubscription.id, {
                        subscriptionPlan: purchaseId,
                        paymentId: ((_j = session.payment_intent) === null || _j === void 0 ? void 0 : _j.toString()) || '',
                        paymentStatus: session.payment_status,
                        callsRemaining: (_l = (_k = plan.accessLevel) === null || _k === void 0 ? void 0 : _k.expertCallsPerMonth) !== null && _l !== void 0 ? _l : 0,
                        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
                    });
                    res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Subscription updated Successfully", order, updatedSubscription });
                }
                else {
                    const order = yield this._orderService.createOrder({
                        userId,
                        itemId: purchaseId,
                        type: "SubscriptionPlan",
                        title: plan.name,
                        amount: plan.price,
                        currency: ((_m = session.currency) === null || _m === void 0 ? void 0 : _m.toUpperCase()) || 'INR',
                        stripeSessionId: sessionId,
                        paymentIntentId: ((_o = session.payment_intent) === null || _o === void 0 ? void 0 : _o.toString()) || '',
                        paymentStatus: session.payment_status,
                    });
                    yield this._orderService.createUserSubscription(userId, purchaseId, ((_p = session.payment_intent) === null || _p === void 0 ? void 0 : _p.toString()) || '', session.payment_status, (_r = (_q = plan.accessLevel) === null || _q === void 0 ? void 0 : _q.expertCallsPerMonth) !== null && _r !== void 0 ? _r : 0);
                    res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Subscription purchased Successfully", order });
                }
            }
        }));
        this.failedOrder = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const { sessionId } = req.body;
            if (!sessionId) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Session ID is required" });
                return;
            }
            const session = yield stripe.checkout.sessions.retrieve(sessionId);
            if (session.payment_status == 'paid') {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: 'Payment successful' });
                return;
            }
            const existing = yield this._orderService.checkOrderExisting(sessionId);
            if (existing) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: 'Order already exists' });
                return;
            }
            const purchaseId = ((_a = session.metadata) === null || _a === void 0 ? void 0 : _a.courseId) || ((_b = session.metadata) === null || _b === void 0 ? void 0 : _b.planId);
            const isCourse = !!((_c = session.metadata) === null || _c === void 0 ? void 0 : _c.courseId);
            const userId = (_d = session.metadata) === null || _d === void 0 ? void 0 : _d.userId;
            if (!userId || !purchaseId) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ message: errorMessage_1.ERROR_MESSAGES.UNAUTHORIZED || 'Unauthorized access', });
                return;
            }
            if (isCourse) {
                const course = yield this._orderService.getCourseById(purchaseId);
                if (!course)
                    throw new Error('Course not found');
                const order = yield this._orderService.createOrder({
                    userId,
                    itemId: purchaseId,
                    type: "Course",
                    title: course.title,
                    amount: course.price,
                    currency: ((_e = session.currency) === null || _e === void 0 ? void 0 : _e.toUpperCase()) || 'INR',
                    stripeSessionId: sessionId,
                    paymentIntentId: ((_f = session.payment_intent) === null || _f === void 0 ? void 0 : _f.toString()) || '',
                    paymentStatus: session.payment_status,
                });
                res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Courses purchased Successfully", order });
            }
            else {
                const plan = yield this._orderService.getPlanById(purchaseId);
                if (!plan)
                    throw new Error('Subscription is not found');
                const order = yield this._orderService.createOrder({
                    userId,
                    itemId: purchaseId,
                    type: "SubscriptionPlan",
                    title: plan.name,
                    amount: plan.price,
                    currency: ((_g = session.currency) === null || _g === void 0 ? void 0 : _g.toUpperCase()) || 'INR',
                    stripeSessionId: sessionId,
                    paymentIntentId: ((_h = session.payment_intent) === null || _h === void 0 ? void 0 : _h.toString()) || '',
                    paymentStatus: session.payment_status,
                });
                res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Subscription purchased Successfully", order });
            }
        }));
        this.getPurchaseHistory = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            if (!userId) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.UNAUTHORIZED || 'Unauthorized access', });
                return;
            }
            const purchases = yield this._orderService.getOrderById(userId);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, purchases });
        }));
        this.getPurchasedCourse = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            if (!userId) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.UNAUTHORIZED || 'Unauthorized access', });
                return;
            }
            // 1. Get all purchased courses for the user
            const courses = yield this._orderService.getCourseByUser(userId);
            if (!courses || courses.length === 0) {
                res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, data: [] });
                return;
            }
            // 2. Get progress data for all courses
            const progressList = yield this._orderService.getProgressByUser(userId);
            const progressMap = {};
            (progressList || []).forEach(progress => { progressMap[progress.course.toString()] = progress; });
            const purchasedCourses = yield Promise.all(courses.map((course) => __awaiter(this, void 0, void 0, function* () {
                const courseId = course.id.toString();
                const order = yield this._orderService.getPurchasedByUser(userId, courseId);
                const progress = progressMap[courseId] || { totalCompletedPercent: 0, progress: [], lastWatchedAt: null };
                return { course, progress, purchaseDate: (order === null || order === void 0 ? void 0 : order.createdAt) || course.createdAt };
            })));
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, data: purchasedCourses });
        }));
        this.subscriptionCheckout = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { planId } = req.body;
            const userId = req.userId;
            if (!userId) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ message: "User authentication required." });
                return;
            }
            const planData = yield this._orderService.getPlanById(planId);
            if (!planData || !planData.name || !planData.features || !planData.price || !planData._id) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ message: errorMessage_1.ERROR_MESSAGES.INVALID_INPUT || "Plan data is missing or incomplete." });
                return;
            }
            // const existingSubscriptions: IUserSubscription[] | null = await this._orderService.checkPlan(userId, planId);
            // const now = new Date();
            // const activeSubscription = existingSubscriptions?.find(sub => {
            //     return sub.isActive && new Date(sub.endDate) > now;
            // });
            // if (activeSubscription) {
            //     res.status(STATUS_CODES.BAD_REQUEST).json({ message: "You already have an active subscription to this plan." });
            //     return;
            // }
            const session = yield stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: [
                    {
                        price_data: {
                            currency: 'inr',
                            product_data: {
                                name: planData.name,
                                description: `• ${planData.features.join('\n• ')}`,
                            },
                            unit_amount: planData.price * 100,
                        },
                        quantity: 1,
                    },
                ],
                success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&planId=${planData._id}`,
                cancel_url: `${process.env.CLIENT_URL}/payment-failed?session_id={CHECKOUT_SESSION_ID}&planId=${planData._id}`,
                metadata: {
                    userId,
                    planId: String(planData._id),
                },
            });
            res.status(statusCode_1.STATUS_CODES.OK).json({ url: session.url });
        }));
        this.slotBooking = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            if (!userId) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.UNAUTHORIZED || "Unauthorized access", });
                return;
            }
            const { expertId, availabilityId, meetingLink } = req.body;
            if (!expertId || !availabilityId) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: "expertId and availabilityId are required", });
                return;
            }
            // Check if slot is already booked
            const existingSession = yield this._orderService.checkSessionAvailable(expertId, availabilityId);
            if (((existingSession === null || existingSession === void 0 ? void 0 : existingSession.status) === "completed" || (existingSession === null || existingSession === void 0 ? void 0 : existingSession.status) === "missed")) {
                res.status(statusCode_1.STATUS_CODES.CONFLICT).json({ status: false, message: "This slot is already completed or missed", });
                return;
            }
            if ((existingSession === null || existingSession === void 0 ? void 0 : existingSession.status) == "upcoming") {
                res.status(statusCode_1.STATUS_CODES.CONFLICT).json({ status: false, message: "This slot is already booked.", });
                return;
            }
            // Check user subscription
            const subscription = yield this._orderService.getActiveSubscription(userId);
            if (!subscription) {
                res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ status: false, message: "No active subscription found.", });
                return;
            }
            if (subscription.callsRemaining === undefined) {
                subscription.callsRemaining = 0;
            }
            if (subscription.callsRemaining == 0) {
                res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ status: false, message: "You have reached your monthly call limit.", });
                return;
            }
            const sessionData = { userId, expertId, availabilityId, meetingLink };
            const newSession = yield this._orderService.createSession(sessionData);
            yield this._orderService.updateSubscription(userId, subscription.subscriptionPlan.toString());
            res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Session created successfully", session: newSession, remainingCalls: subscription.callsRemaining, });
        }));
        this.getSessionsByUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            if (!userId) {
                res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.UNAUTHORIZED || 'Unauthorized access', });
                return;
            }
            const sessions = yield this._orderService.getUserSessions(userId);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, sessions, });
        }));
        this._orderService = orderService;
    }
}
exports.default = OrderController;
