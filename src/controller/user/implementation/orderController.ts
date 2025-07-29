import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/message"

import IOrderController from "../IOrderController";
import IOrderService from "../../../service/user/IOrderService";
import { IUserSubscription, UserSubscription } from "../../../model/user/userSubscriptionSchema";

import Stripe from "stripe";
import mongoose, { Types } from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-06-30.basil' });


class OrderController implements IOrderController {
    private orderService: IOrderService;
    constructor(orderService: IOrderService) {
        this.orderService = orderService;
    }

    async createCheckoutSession(req: Request, res: Response): Promise<void> {
        const { course } = req.body;
        const userId = req.userId;
        if (!course || !course.title || !course.description || !course.price || !course._id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ message: ERROR_MESSAGES.INVALID_INPUT || "Course data is missing or incomplete.", });
            return;
        }
        if (!userId) {
            res.status(STATUS_CODES.UNAUTHORIZED).json({ message: "User authentication required.", });
            return;
        }
        if (course.purchasedUsers?.some((id: mongoose.Types.ObjectId) => id.toString() === userId)) {
            res.status(STATUS_CODES.UNAUTHORIZED).json({ message: "Already Purchased" });
            return;
        }
        try {
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
                cancel_url: `${process.env.CLIENT_URL}/payment-failed`,
                metadata: {
                    userId: userId,
                    courseId: course._id,
                },
            });
            res.status(STATUS_CODES.OK).json({ url: session.url });
            return;
        } catch (error) {
            console.error('Stripe error:', error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                message: "Payment session creation failed.",
            });
            return;
        }
    }

    async createOrder(req: Request, res: Response): Promise<void> {
        const { sessionId } = req.body;
        if (!sessionId) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Session ID is required" });
            return;
        }
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            if (!session || session.payment_status !== 'paid') {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: 'Payment not successful' });
                return
            }
            const existing = await this.orderService.checkOrderExisting(sessionId);
            if (existing) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: 'Order already exists' });
                return
            }
            const purchaseId = session.metadata?.courseId || session.metadata?.planId;
            const isCourse = !!session.metadata?.courseId;
            const userId = session.metadata?.userId;
            if (!userId || !purchaseId) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: ERROR_MESSAGES.UNAUTHORIZED || 'Unauthorized access', });
                return
            }
            if (isCourse) {
                const course = await this.orderService.getCourseById(purchaseId);
                if (!course) throw new Error('Course not found');
                const order = await this.orderService.createOrder({
                    userId,
                    itemId: purchaseId,
                    type: "Course",
                    title: course.title,
                    amount: course.price,
                    currency: session.currency?.toUpperCase() || 'INR',
                    stripeSessionId: sessionId,
                    paymentIntentId: session.payment_intent?.toString() || '',
                    paymentStatus: session.payment_status,
                })
                await this.orderService.updateCourse(purchaseId, userId)
                res.status(STATUS_CODES.CREATED).json({ status: true, message: "Courses purchased Successfully", order })
            } else {
                const plan = await this.orderService.getPlanById(purchaseId);
                if (!plan) throw new Error('Subscription is not found');
                const order = await this.orderService.createOrder({
                    userId,
                    itemId: purchaseId,
                    type: "SubscriptionPlan",
                    title: plan.name,
                    amount: plan.price,
                    currency: session.currency?.toUpperCase() || 'INR',
                    stripeSessionId: sessionId,
                    paymentIntentId: session.payment_intent?.toString() || '',
                    paymentStatus: session.payment_status,
                })
                await this.orderService.createUserSubscription(userId, purchaseId, session.payment_intent?.toString() || '', session.payment_status as 'paid' | 'pending' | 'failed', plan.accessLevel?.expertCallsPerMonth ?? 0);
                res.status(STATUS_CODES.CREATED).json({ status: true, message: "Subscription purchased Successfully", order })
            }
        } catch (error) {
            console.error("Failed to create order", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to create order", });
        }
    }

    async getPurchaseHistory(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ status: false, message: ERROR_MESSAGES.UNAUTHORIZED || 'Unauthorized access', });
                return
            }
            const purchases = await this.orderService.getOrderById(userId)
            res.status(STATUS_CODES.OK).json({ status: true, purchases });
        } catch (error) {
            console.error('Error fetching purchases:', error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR || 'Server error', });
        }
    }

    async getPurchasedCourse(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ status: false, message: ERROR_MESSAGES.UNAUTHORIZED || 'Unauthorized access', });
                return;
            }
            // 1. Get all purchased courses for the user
            const courses = await this.orderService.getCourseByUser(userId);
            if (!courses || courses.length === 0) {
                res.status(STATUS_CODES.OK).json({ status: true, data: [] });
                return;
            }
            // 2. Get progress data for all courses
            const progressList = await this.orderService.getProgressByUser(userId);
            const progressMap: Record<string, any> = {};
            (progressList || []).forEach(progress => { progressMap[progress.course.toString()] = progress; });
            const purchasedCourses = await Promise.all(
                courses.map(async (course) => {
                    const courseId = course.id.toString()
                    const order = await this.orderService.getPurchasedByUser(userId, courseId);
                    const progress = progressMap[courseId] || { totalCompletedPercent: 0, progress: [], lastWatchedAt: null };
                    return { course, progress, purchaseDate: order?.createdAt || course.createdAt };
                })
            );
            res.status(STATUS_CODES.OK).json({ status: true, data: purchasedCourses });
        } catch (error) {
            console.error('Error fetching purchases:', error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR || 'Server error' });
        }
    }

    async subscriptionCheckout(req: Request, res: Response): Promise<void> {
        const { planId } = req.body;
        const userId = req.userId;
        if (!userId) {
            res.status(STATUS_CODES.UNAUTHORIZED).json({ message: "User authentication required." });
            return;
        }
        try {
            const planData = await this.orderService.getPlanById(planId);
            if (!planData || !planData.name || !planData.features || !planData.price || !planData._id) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: ERROR_MESSAGES.INVALID_INPUT || "Plan data is missing or incomplete." });
                return;
            }
            const existingSubscriptions: IUserSubscription[] | null = await this.orderService.checkPlan(userId, planId);
            const now = new Date();
            const activeSubscription = existingSubscriptions?.find(sub => {
                return sub.isActive && new Date(sub.endDate) > now;
            });
            if (activeSubscription) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "You already have an active subscription to this plan." });
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
                                name: planData.name,
                                description: `• ${planData.features.join('\n• ')}`,
                            },
                            unit_amount: planData.price * 100,
                        },
                        quantity: 1,
                    },
                ],
                success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&planId=${planData._id}`,
                cancel_url: `${process.env.CLIENT_URL}/payment-failed`,
                metadata: {
                    userId,
                    planId: String(planData._id),
                },
            });
            res.status(STATUS_CODES.OK).json({ url: session.url });
        } catch (error) {
            console.error("Stripe error:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: "Payment session creation failed." });
        }
    }

    async slotBooking(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ status: false, message: ERROR_MESSAGES.UNAUTHORIZED || "Unauthorized access", });
                return;
            }
            const { expertId, availabilityId, meetingLink } = req.body;
            console.log("request data", req.body);
            if (!expertId || !availabilityId) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "expertId and availabilityId are required", });
                return;
            }
            // Check user subscription
            // const subscription = await UserSubscription.findOne({ user: userId, isActive: true,}).populate("subscriptionPlan");
            const subscription = await this.orderService.getActiveSubscription(userId);
            if (!subscription) {
                res.status(STATUS_CODES.FORBIDDEN).json({ status: false, message: "No active subscription found.", });
                return;
            }
            if (subscription.callsRemaining === undefined) {
                subscription.callsRemaining = 0;
            }
            if (subscription.callsRemaining == 0) {
                res.status(STATUS_CODES.FORBIDDEN).json({ status: false, message: "You have reached your monthly call limit.", });
                return;
            }
            const sessionData = { userId, expertId, availabilityId, meetingLink };
            const newSession = await this.orderService.createSession(sessionData);
            // subscription.callsRemaining -= 1;
            // await subscription.save();
            await this.orderService.updateSubscription(userId, subscription.id)
            res.status(STATUS_CODES.CREATED).json({ status: true, message: "Session created successfully", session: newSession, remainingCalls: subscription.callsRemaining, });
        } catch (error) {
            console.error("Error creating session:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "Could not create session",
            });
        }
    }

    async getSessionsByUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ status: false, message: ERROR_MESSAGES.UNAUTHORIZED || 'Unauthorized access', });
                return
            }
            const sessions = await this.orderService.getUserSessions(userId);
            res.status(STATUS_CODES.OK).json({ status: true, sessions, });
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false });
        }
    }
}


export default OrderController;