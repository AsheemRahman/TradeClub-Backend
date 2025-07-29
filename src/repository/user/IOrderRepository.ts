import { ISubscriptionPlan } from "../../model/admin/subscriptionSchema";
import { ISession } from "../../model/expert/sessionSchema";
import { IOrder } from "../../model/user/orderSchema";
import { IUserSubscription } from "../../model/user/userSubscriptionSchema";
import { CreateSessionDTO, IOrderInput } from "../../types/IUser";


interface IOrderRepository {
    createOrder(order: IOrderInput): Promise<IOrder | null>;
    getOrderById(id: string): Promise<IOrder[] | null>;
    checkOrderExisting(id: string): Promise<IOrder | null>;
    getPurchasedByUser(userId: string, courseIds: string): Promise<IOrder | null>;

    getPlanById(planId: string): Promise<ISubscriptionPlan | null>;
    checkPlan(userId: string, planId: string): Promise<IUserSubscription[] | null>;

    createSubscription(data: Partial<IUserSubscription>): Promise<IUserSubscription>;
    findActiveSubscription(userId: string): Promise<IUserSubscription | null>;
    findByUserAndPlan(userId: string, planId: string): Promise<IUserSubscription | null>;
    deactivateSubscription(userId: string): Promise<void>;
    getAllSubscriptionsByUser(userId: string): Promise<IUserSubscription[] | null>;
    updateSubscription(userId: string, planId: string): Promise<IUserSubscription | null>;

    createSession(data: CreateSessionDTO): Promise<ISession | null>;
    getSessionsByUser(userId: string): Promise<ISession[] | null>;
    updateSessionStatus(sessionId: string, status: 'completed' | 'missed'): Promise<ISession | null>;
}


export default IOrderRepository;