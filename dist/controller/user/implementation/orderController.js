"use strict";
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
    _orderService;
    constructor(orderService) {
        this._orderService = orderService;
    }
    createCheckoutSession = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
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
        if (course.purchasedUsers?.some((id) => id.toString() === userId)) {
            res.status(statusCode_1.STATUS_CODES.CONFLICT).json({ message: "Already Purchased" });
            return;
        }
        const session = await stripe.checkout.sessions.create({
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
    });
    createOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { sessionId } = req.body;
        if (!sessionId) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Session ID is required" });
            return;
        }
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (!session || session.payment_status !== 'paid') {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: 'Payment not successful' });
            return;
        }
        const existing = await this._orderService.checkOrderExisting(sessionId);
        if (existing) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: 'Order already exists' });
            return;
        }
        const purchaseId = session.metadata?.courseId || session.metadata?.planId;
        const isCourse = !!session.metadata?.courseId;
        const userId = session.metadata?.userId;
        if (!userId || !purchaseId) {
            res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ message: errorMessage_1.ERROR_MESSAGES.UNAUTHORIZED || 'Unauthorized access', });
            return;
        }
        if (isCourse) {
            const course = await this._orderService.getCourseById(purchaseId);
            if (!course)
                throw new Error('Course not found');
            const order = await this._orderService.createOrder({
                userId,
                itemId: purchaseId,
                type: "Course",
                title: course.title,
                amount: course.price,
                currency: session.currency?.toUpperCase() || 'INR',
                stripeSessionId: sessionId,
                paymentIntentId: session.payment_intent?.toString() || '',
                paymentStatus: session.payment_status,
            });
            await this._orderService.updateCourse(purchaseId, userId);
            res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Courses purchased Successfully", order });
        }
        else {
            const plan = await this._orderService.getPlanById(purchaseId);
            if (!plan)
                throw new Error('Subscription is not found');
            // Check if user already has an active subscription
            const existingSubscription = await this._orderService.getActiveSubscription(userId);
            if (existingSubscription) {
                // Update the existing subscription
                const order = await this._orderService.createOrder({
                    userId,
                    itemId: purchaseId,
                    type: "SubscriptionPlan",
                    title: plan.name,
                    amount: plan.price,
                    currency: session.currency?.toUpperCase() || 'INR',
                    stripeSessionId: sessionId,
                    paymentIntentId: session.payment_intent?.toString() || '',
                    paymentStatus: session.payment_status,
                });
                const updatedSubscription = await this._orderService.updateUserSubscription(existingSubscription.id, {
                    subscriptionPlan: purchaseId,
                    paymentId: session.payment_intent?.toString() || '',
                    paymentStatus: session.payment_status,
                    callsRemaining: plan.accessLevel?.expertCallsPerMonth ?? 0,
                    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
                });
                res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Subscription updated Successfully", order, updatedSubscription });
            }
            else {
                const order = await this._orderService.createOrder({
                    userId,
                    itemId: purchaseId,
                    type: "SubscriptionPlan",
                    title: plan.name,
                    amount: plan.price,
                    currency: session.currency?.toUpperCase() || 'INR',
                    stripeSessionId: sessionId,
                    paymentIntentId: session.payment_intent?.toString() || '',
                    paymentStatus: session.payment_status,
                });
                await this._orderService.createUserSubscription(userId, purchaseId, session.payment_intent?.toString() || '', session.payment_status, plan.accessLevel?.expertCallsPerMonth ?? 0);
                res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Subscription purchased Successfully", order });
            }
        }
    });
    failedOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { sessionId } = req.body;
        if (!sessionId) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Session ID is required" });
            return;
        }
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status == 'paid') {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: 'Payment successful' });
            return;
        }
        const existing = await this._orderService.checkOrderExisting(sessionId);
        if (existing) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: 'Order already exists' });
            return;
        }
        const purchaseId = session.metadata?.courseId || session.metadata?.planId;
        const isCourse = !!session.metadata?.courseId;
        const userId = session.metadata?.userId;
        if (!userId || !purchaseId) {
            res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ message: errorMessage_1.ERROR_MESSAGES.UNAUTHORIZED || 'Unauthorized access', });
            return;
        }
        if (isCourse) {
            const course = await this._orderService.getCourseById(purchaseId);
            if (!course)
                throw new Error('Course not found');
            const order = await this._orderService.createOrder({
                userId,
                itemId: purchaseId,
                type: "Course",
                title: course.title,
                amount: course.price,
                currency: session.currency?.toUpperCase() || 'INR',
                stripeSessionId: sessionId,
                paymentIntentId: session.payment_intent?.toString() || '',
                paymentStatus: session.payment_status,
            });
            res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Courses purchased Successfully", order });
        }
        else {
            const plan = await this._orderService.getPlanById(purchaseId);
            if (!plan)
                throw new Error('Subscription is not found');
            const order = await this._orderService.createOrder({
                userId,
                itemId: purchaseId,
                type: "SubscriptionPlan",
                title: plan.name,
                amount: plan.price,
                currency: session.currency?.toUpperCase() || 'INR',
                stripeSessionId: sessionId,
                paymentIntentId: session.payment_intent?.toString() || '',
                paymentStatus: session.payment_status,
            });
            res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Subscription purchased Successfully", order });
        }
    });
    getPurchaseHistory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        if (!userId) {
            res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.UNAUTHORIZED || 'Unauthorized access', });
            return;
        }
        const purchases = await this._orderService.getOrderById(userId);
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, purchases });
    });
    getPurchasedCourse = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        if (!userId) {
            res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.UNAUTHORIZED || 'Unauthorized access', });
            return;
        }
        // 1. Get all purchased courses for the user
        const courses = await this._orderService.getCourseByUser(userId);
        if (!courses || courses.length === 0) {
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, data: [] });
            return;
        }
        // 2. Get progress data for all courses
        const progressList = await this._orderService.getProgressByUser(userId);
        const progressMap = {};
        (progressList || []).forEach(progress => { progressMap[progress.course.toString()] = progress; });
        const purchasedCourses = await Promise.all(courses.map(async (course) => {
            const courseId = course.id.toString();
            const order = await this._orderService.getPurchasedByUser(userId, courseId);
            const progress = progressMap[courseId] || { totalCompletedPercent: 0, progress: [], lastWatchedAt: null };
            return { course, progress, purchaseDate: order?.createdAt || course.createdAt };
        }));
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, data: purchasedCourses });
    });
    subscriptionCheckout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { planId } = req.body;
        const userId = req.userId;
        if (!userId) {
            res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ message: "User authentication required." });
            return;
        }
        const planData = await this._orderService.getPlanById(planId);
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
        const session = await stripe.checkout.sessions.create({
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
    });
    slotBooking = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
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
        const existingSession = await this._orderService.checkSessionAvailable(expertId, availabilityId);
        if ((existingSession?.status === "completed" || existingSession?.status === "missed")) {
            res.status(statusCode_1.STATUS_CODES.CONFLICT).json({ status: false, message: "This slot is already completed or missed", });
            return;
        }
        if (existingSession?.status == "upcoming") {
            res.status(statusCode_1.STATUS_CODES.CONFLICT).json({ status: false, message: "This slot is already booked.", });
            return;
        }
        // Check user subscription
        const subscription = await this._orderService.getActiveSubscription(userId);
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
        const newSession = await this._orderService.createSession(sessionData);
        await this._orderService.updateSubscription(userId, subscription.subscriptionPlan.toString());
        res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Session created successfully", session: newSession, remainingCalls: subscription.callsRemaining, });
    });
    getSessionsByUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        if (!userId) {
            res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.UNAUTHORIZED || 'Unauthorized access', });
            return;
        }
        const sessions = await this._orderService.getUserSessions(userId);
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, sessions, });
    });
}
exports.default = OrderController;
//# sourceMappingURL=orderController.js.map