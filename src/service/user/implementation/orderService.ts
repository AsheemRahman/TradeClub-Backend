import { ICourse } from "../../../model/admin/courseSchema";
import { ISubscriptionPlan } from "../../../model/admin/subscriptionSchema";
import { ISession } from "../../../model/expert/sessionSchema";
import { IOrder } from "../../../model/user/orderSchema";
import { ICourseProgress } from "../../../model/user/progressSchema";
import { IUserSubscription } from "../../../model/user/userSubscriptionSchema";
import IEarningRepository from "../../../repository/expert/IEarningRepository";
import ICourseRepository from "../../../repository/user/ICourseRepository";
import IOrderRepository from "../../../repository/user/IOrderRepository";
import { CreateSessionDTO, IOrderInput } from "../../../types/IUser";
import IOrderService from "../IOrderService";
import mongoose from 'mongoose';


class OrderService implements IOrderService {
    private _orderRepository: IOrderRepository;
    private _courseRepository: ICourseRepository;
    private _earningRepository: IEarningRepository;

    constructor(orderRepository: IOrderRepository, courseRepository: ICourseRepository, earingRepository: IEarningRepository) {
        this._orderRepository = orderRepository;
        this._courseRepository = courseRepository;
        this._earningRepository = earingRepository;
    };

    async getCourseById(courseId: string): Promise<ICourse | null> {
        const Course = await this._courseRepository.getCourseById(courseId);
        return Course;
    }

    async updateCourse(courseId: string, purchasedUsers: string): Promise<ICourse | null> {
        const Courses = await this._courseRepository.updateCourse(courseId, purchasedUsers);
        return Courses;
    }

    async getCourseByUser(userId: string): Promise<ICourse[] | null> {
        const Courses = await this._courseRepository.getCourseByUser(userId);
        return Courses;
    }

    async getProgressByUser(userId: string): Promise<ICourseProgress[] | null> {
        const Courses = await this._courseRepository.getAllProgress(userId);
        return Courses;
    }

    async createOrder(order: IOrderInput): Promise<IOrder | null> {
        const newOrder = await this._orderRepository.createOrder(order);
        return newOrder;
    }

    async getOrderById(orderId: string): Promise<IOrder[] | null> {
        const Course = await this._orderRepository.getOrderById(orderId);
        return Course;
    }

    async checkOrderExisting(orderId: string): Promise<IOrder | null> {
        const order = await this._orderRepository.checkOrderExisting(orderId);
        return order;
    }

    async getPurchasedByUser(userId: string, courseId: string): Promise<IOrder | null> {
        const order = await this._orderRepository.getPurchasedByUser(userId, courseId);
        return order;
    }

    async getPlanById(planId: string): Promise<ISubscriptionPlan | null> {
        const planData = await this._orderRepository.getPlanById(planId);
        return planData;
    }

    async checkPlan(userId: string, planId: string): Promise<IUserSubscription[] | null> {
        const Data = await this._orderRepository.checkPlan(userId, planId);
        return Data;
    }

    async createUserSubscription(userId: string, planId: string, paymentId: string, paymentStatus: 'paid' | 'pending' | 'failed', callsRemaining: number, durationInDays: number = 30, autoRenew: boolean = false,): Promise<IUserSubscription> {
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + durationInDays);
        await this._orderRepository.deactivateSubscription(userId);
        return await this._orderRepository.createSubscription({
            user: userId, subscriptionPlan: planId, startDate, endDate, isActive: true,
            paymentId, paymentStatus, autoRenew, callsRemaining
        });
    }

    async getActiveSubscription(userId: string): Promise<IUserSubscription | null> {
        return await this._orderRepository.findActiveSubscription(userId);
    }

    async getAllSubscriptionsByUser(userId: string): Promise<IUserSubscription[] | null> {
        return await this._orderRepository.getAllSubscriptionsByUser(userId);
    }

    async updateSubscription(userId: string, planId: string): Promise<IUserSubscription | null> {
        return await this._orderRepository.updateSubscription(userId, planId);
    }

    async createSession(data: CreateSessionDTO): Promise<ISession | null> {
        return await this._orderRepository.createSession(data);
    }

    async checkSessionAvailable(expertId: string, availabilityId: string): Promise<ISession | null> {
        return await this._orderRepository.checkSessionAvailable(expertId, availabilityId);
    }

    async getUserSessions(userId: string): Promise<ISession[] | null> {
        return await this._orderRepository.getSessionsByUser(userId);
    }

    async markSessionStatus(sessionId: string, status: 'completed' | 'missed'): Promise<ISession | null> {
        const session = await this._orderRepository.updateSessionStatus(sessionId, status);
        if (!session) return null;
        if (status === 'completed' && session.expertId) {
            const sessionObjectId = session._id as unknown as string;
            await this._earningRepository.createEarning({
                expertId: session?.expertId,
                sessionId: new mongoose.Types.ObjectId(sessionObjectId),
                amount: 100,
                status: "pending"
            });
        }
        return session
    }
}


export default OrderService;