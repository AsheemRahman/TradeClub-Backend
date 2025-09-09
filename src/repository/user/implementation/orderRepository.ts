import { ISubscriptionPlan, SubscriptionPlan } from "../../../model/admin/subscriptionSchema";
import { ExpertAvailability } from "../../../model/expert/AvailabilitySchema";
import { ISession, Session } from "../../../model/expert/sessionSchema";
import { IOrder, Order } from "../../../model/user/orderSchema";
import { IUserSubscription, UserSubscription } from "../../../model/user/userSubscriptionSchema";
import { CreateSessionDTO, IOrderInput } from "../../../types/IUser";
import IOrderRepository from "../IOrderRepository";


class OrderRepository implements IOrderRepository {
    async createOrder(order: IOrderInput): Promise<IOrder | null> {
        const newOrder = await Order.create(order);
        return newOrder;
    };

    async getOrderById(id: string): Promise<IOrder[] | null> {
        const orders = await Order.find({ userId: id }).sort({ createdAt: -1 });;
        return orders;
    };

    async checkOrderExisting(orderId: string): Promise<IOrder | null> {
        const order = await Order.findOne({ stripeSessionId: orderId });
        return order;
    };

    async getPurchasedByUser(userId: string, courseId: string): Promise<IOrder | null> {
        const order = await Order.findOne({ userId, itemId: courseId }).lean();
        return order;
    };

    async getPlanById(planId: string): Promise<ISubscriptionPlan | null> {
        const planData = await SubscriptionPlan.findById(planId)
        return planData;
    }

    async checkPlan(userId: string, planId: string): Promise<IUserSubscription[] | null> {
        const Data = await UserSubscription.find({ user: userId, subscriptionPlan: planId, isActive: true, })
        return Data;
    }

    async createSubscription(data: Partial<IUserSubscription>): Promise<IUserSubscription> {
        return await UserSubscription.create(data);
    }

    async findActiveSubscription(userId: string): Promise<IUserSubscription | null> {
        return await UserSubscription.findOne({ user: userId, isActive: true, });
    }

    async findByUserAndPlan(userId: string, planId: string): Promise<IUserSubscription | null> {
        return await UserSubscription.findOne({ user: userId, subscriptionPlan: planId, });
    }

    async deactivateSubscription(userId: string): Promise<void> {
        await UserSubscription.updateMany({ user: userId, isActive: true }, { $set: { isActive: false } });
    }

    async getAllSubscriptionsByUser(userId: string): Promise<IUserSubscription[] | null> {
        return await UserSubscription.find({ user: userId });
    }

    async updateSubscription(userId: string, planId: string): Promise<IUserSubscription | null> {
        const res = await UserSubscription.findOneAndUpdate({ user: userId, subscriptionPlan: planId, isActive: true, $expr: { $gt: ["$endDate", new Date()] } }, { $inc: { callsRemaining: -1 } }, { new: true });
        return res
    }

    async createSession(data: CreateSessionDTO): Promise<ISession | null> {
        await ExpertAvailability.findByIdAndUpdate(data.availabilityId, { isBooked: true });
        return await Session.create({ ...data, status: 'upcoming', bookedAt: new Date(), });
    }

    async getSessionsByUser(userId: string): Promise<ISession[] | null> {
        return await Session.find({ userId }).populate('expertId availabilityId');
    }

    async updateSessionStatus(sessionId: string, status: 'completed' | 'missed'): Promise<ISession | null> {
        return await Session.findByIdAndUpdate(sessionId, { status }, { new: true });
    }
}

export default OrderRepository;