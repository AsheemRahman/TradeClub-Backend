import { ICourse } from "../../model/admin/courseSchema";
import { ISubscriptionPlan } from "../../model/admin/subscriptionSchema";
import { ISession } from "../../model/expert/sessionSchema";
import { IOrder } from "../../model/user/orderSchema";
import { ICourseProgress } from "../../model/user/progressSchema";
import { IUserSubscription } from "../../model/user/userSubscriptionSchema";
import { CreateSessionDTO, IOrderInput } from "../../types/IUser";

interface IOrderService {
    getCourseById(id: string): Promise<ICourse | null>;
    updateCourse(courseId: string, purchasedUsers: string): Promise<ICourse | null>;
    getCourseByUser(userId: string): Promise<ICourse[] | null>;

    getOrderById(id: string): Promise<IOrder[] | null>;
    createOrder(order: IOrderInput): Promise<IOrder | null>;
    getPurchasedByUser(userId: string, courseIds: string): Promise<IOrder | null>;
    checkOrderExisting(id: string): Promise<IOrder | null>;

    getProgressByUser(userId: string): Promise<ICourseProgress[] | null>;

    getPlanById(planId: string): Promise<ISubscriptionPlan | null>;
    checkPlan(userId: string, planId: string): Promise<IUserSubscription[] | null>;

    createUserSubscription(userId: string, planId: string, paymentId: string, paymentStatus: 'paid' | 'pending' | 'failed'): Promise<IUserSubscription>;
    getAllSubscriptionsByUser(userId: string): Promise<IUserSubscription[] | null>;
    getActiveSubscription(userId: string): Promise<IUserSubscription | null>

    createSession(data: CreateSessionDTO): Promise<ISession | null>;
    getUserSessions(userId: string): Promise<ISession[] | null>;
    markSessionStatus(sessionId: string, status: 'completed' | 'missed'): Promise<ISession | null>;
}

export default IOrderService;