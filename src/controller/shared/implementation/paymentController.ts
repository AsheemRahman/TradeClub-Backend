import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/message";
import ICourseController from "../IPaymentController";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-06-30.basil',
});

class PaymentController implements ICourseController {
    async createCheckoutSession(req: Request, res: Response): Promise<void> {
        const { course } = req.body;
        const userId = req.userId;

        if (!course || !course.title || !course.description || !course.price || !course._id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({
                message: ERROR_MESSAGES.INVALID_INPUT || "Course data is missing or incomplete.",
            });
            return;
        }

        if (!userId) {
            res.status(STATUS_CODES.UNAUTHORIZED).json({
                message: "User authentication required.",
            });
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
}

export default PaymentController;