import mongoose from "mongoose";
import { ICourse } from "../../model/admin/courseSchema";
import { ISubscriptionPlan } from "../../model/admin/subscriptionSchema";
import { IExpertAvailability } from "../../model/expert/availabilitySchema";
import { ISession } from "../../model/expert/sessionSchema";
import { IOrder } from "../../model/user/orderSchema";
import { ICourseProgress } from "../../model/user/progressSchema";
import { IUserSubscription } from "../../model/user/userSubscriptionSchema";
import { CreateSessionDTO, IOrderInput } from "../../types/IUser";

interface IOrderService {
    getCourseById(courseId: string): Promise<ICourse | null>;
    updateCourse(courseId: string, purchasedUsers: string): Promise<ICourse | null>;
    getCourseByUser(userId: string): Promise<ICourse[] | null>;

    getOrderById(orderId: string): Promise<IOrder[] | null>;
    createOrder(order: IOrderInput): Promise<IOrder | null>;
    getPurchasedByUser(userId: string, courseIds: string): Promise<IOrder | null>;
    checkOrderExisting(id: string): Promise<IOrder | null>;

    getProgressByUser(userId: string): Promise<ICourseProgress[] | null>;

    getPlanById(planId: string): Promise<ISubscriptionPlan | null>;
    checkPlan(userId: string, planId: string): Promise<IUserSubscription[] | null>;

    createUserSubscription(userId: string, planId: string, paymentId: string, paymentStatus: 'paid' | 'pending' | 'failed', callsRemaining: number): Promise<IUserSubscription>;
    updateUserSubscription(subscriptionId: string, updateData: Partial<IUserSubscription>): Promise<IUserSubscription | null>;
    getAllSubscriptionsByUser(userId: string): Promise<IUserSubscription[] | null>;
    getActiveSubscription(userId: string): Promise<IUserSubscription | null>;
    updateSubscription(userId: string, planId: string): Promise<IUserSubscription | null>;

    createSession(data: CreateSessionDTO): Promise<ISession | null>;
    checkSessionAvailable(expertId: string, availabilityId: string): Promise<ISession | null>;
    getUserSessions(userId: string): Promise<ISession[] | null>;
    markSessionStatus(sessionId: string, status: 'completed' | 'missed'): Promise<ISession | null>;
    cancelStatus(sessionId: string): Promise<ISession | null>;
    availabityStatus(availabilityId: mongoose.Types.ObjectId): Promise<IExpertAvailability | null>;
    callCountAdd(availabilityId: string): Promise<IUserSubscription | null>;
}

export default IOrderService;