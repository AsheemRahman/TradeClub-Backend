import mongoose from "mongoose";
import { ISubscriptionPlan } from "../../model/admin/subscriptionSchema";
import { IExpertAvailability } from "../../model/expert/availabilitySchema";
import { ISession } from "../../model/expert/sessionSchema";
import { IOrder } from "../../model/user/orderSchema";
import { IUserSubscription } from "../../model/user/userSubscriptionSchema";
import { CreateSessionDTO, IOrderInput } from "../../types/IUser";


interface IOrderRepository {
    createOrder(order: IOrderInput): Promise<IOrder | null>;
    getOrderById(orderId: string): Promise<IOrder[] | null>;
    checkOrderExisting(orderId: string): Promise<IOrder | null>;
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
    checkSessionAvailable(expertId: string, availabilityId: string): Promise<ISession | null>;
    getSessionsByUser(userId: string): Promise<ISession[] | null>;
    updateSessionStatus(sessionId: string, status: 'completed' | 'missed'): Promise<ISession | null>;
    cancelSession(sessionId: string): Promise<ISession | null>;
    availabityStatus(availabilityId: mongoose.Types.ObjectId): Promise<IExpertAvailability | null>;
    callCountAdd(availabilityId: string): Promise<IUserSubscription | null>;
}


export default IOrderRepository;