import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/message"

import ICourseController from "../ICourseController";
import ICourseService from "../../../service/user/ICourseService";
import Stripe from "stripe";
import { Order } from "../../../model/user/orderSchema";
import Course from "../../../model/admin/courseSchema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-06-30.basil' });


class CourseController implements ICourseController {
    private courseService: ICourseService;

    constructor(courseService: ICourseService) {
        this.courseService = courseService;
    }

    async getCourse(req: Request, res: Response): Promise<void> {
        try {
            const courses = await this.courseService.getCourse();
            res.status(STATUS_CODES.OK).json({ status: true, message: "Courses Fetched Successfully", courses })
        } catch (error) {
            console.error("Failed to fetch Courses", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to fetch Courses", });
        }
    };

    async getCoursebyId(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        try {
            const course = await this.courseService.getCourseById(id)
            if (!course) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
                return
            }
            res.status(STATUS_CODES.OK).json({ status: true, message: "Course Fetched Successfully", course })
        } catch (error) {
            console.error("Failed to fetch Course", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to fetch Course" });
        }
    };

    async getCategory(req: Request, res: Response): Promise<void> {
        try {
            const categories = await this.courseService.getCategory();
            res.status(STATUS_CODES.OK).json({ status: true, message: "Category Fetched Successfully", categories })
        } catch (error) {
            console.error("Failed to fetch category", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to fetch category" });
        }
    };

    async checkEnrolled(req: Request, res: Response): Promise<void> {
        const userId = req.userId;
        const courseId = req.params.id;
        if (!userId || !courseId) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND, });
            return;
        }
        try {
            const course = await this.courseService.getCourseById(courseId);
            if (!course) {
                res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND, });
                return;
            }
            const isEnrolled = course.purchasedUsers?.some((id) => id.toString() === userId);
            res.status(STATUS_CODES.OK).json({ status: true, isEnrolled: Boolean(isEnrolled), });
        } catch (error) {
            console.error("Failed to check enrollment", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to check enrollment", });
        }
    };

    async createOrder(req: Request, res: Response): Promise<void> {
        const { sessionId } = await req.body;
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            if (!session || session.payment_status !== 'paid') {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: 'Payment not successful' });
                return
            }
            const existing = await Order.findOne({ stripeSessionId: sessionId });
            if (existing) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: 'Order already exists' });
            }
            const courseId = session.metadata?.courseId;
            const userId = session.metadata?.userId;
            
            const course = await Course.findById(courseId);
            if (!course) throw new Error('Course not found');
            const order = await Order.create({
                userId,
                courseId,
                courseTitle: course.title,
                coursePrice: course.price,
                currency: session.currency?.toUpperCase() || 'INR',
                stripeSessionId: sessionId,
                paymentIntentId: session.payment_intent?.toString() || '',
                paymentStatus: session.payment_status,
            });
            res.status(STATUS_CODES.CREATED).json({ status: true, message: "Courses Fetched Successfully", order })
        } catch (error) {
            console.error("Failed to create order", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to create order", });
        }
    }
}




export default CourseController;