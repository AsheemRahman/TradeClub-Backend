import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/message";
import ICourseController from "../IPaymentController";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);


class PaymentController implements ICourseController {
    async createCheckoutSession(req: Request, res: Response): Promise<void> {
        const { course } = req.body;

        if (!course || !course.title || !course.description || !course.price) {
            res.status(STATUS_CODES.BAD_REQUEST).json({
                message: ERROR_MESSAGES.INVALID_INPUT || "Course data is missing or incomplete.",
            });
            return
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
                success_url: `${process.env.CLIENT_URL}/payment-success`,
                cancel_url: `${process.env.CLIENT_URL}/courses`,
            });
            res.status(STATUS_CODES.OK).json({ url: session.url });
            return
        } catch (error) {
            console.error('Stripe error:', error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                message: "Payment session creation failed.",
            });
            return
        }
    }
}

export default PaymentController;
