import mongoose from "mongoose";
import { ISubscriptionPlan, SubscriptionPlan } from "../../../model/admin/subscriptionSchema";
import { ExpertAvailability, IExpertAvailability } from "../../../model/expert/availabilitySchema";
import { ISession, Session } from "../../../model/expert/sessionSchema";
import { IOrder, Order } from "../../../model/user/orderSchema";
import { IUserSubscription, UserSubscription } from "../../../model/user/userSubscriptionSchema";
import { CreateSessionDTO, IOrderInput } from "../../../types/IUser";
import { BaseRepository } from "../../base/implementation/baseRepository";
import IOrderRepository from "../IOrderRepository";


class OrderRepository extends BaseRepository<IOrder> implements IOrderRepository {
    constructor() {
        super(Order);
    }

    async createOrder(order: IOrderInput): Promise<IOrder | null> {
        const formattedOrder = { ...order, userId: new mongoose.Types.ObjectId(order.userId), itemId: new mongoose.Types.ObjectId(order.itemId), } as Partial<IOrder>;
        return await this.create(formattedOrder);
    };

    async getOrderById(userId: string): Promise<IOrder[] | null> {
        const orders = await this.model.find({ userId }).sort({ createdAt: -1 });
        return orders;
    };

    async checkOrderExisting(orderId: string): Promise<IOrder | null> {
        const order = await this.model.findOne({ stripeSessionId: orderId });
        return order;
    };

    async getPurchasedByUser(userId: string, courseId: string): Promise<IOrder | null> {
        const order = await this.model.findOne({ userId, itemId: courseId }).lean();
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
        return await UserSubscription.findOne({ user: userId, isActive: true, endDate: { $gt: new Date() }, });
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
        const res = await UserSubscription.findOneAndUpdate({
            user: userId,
            subscriptionPlan: planId,
            isActive: true,
            endDate: { $gt: new Date() },
            callsRemaining: { $gt: 0 }
        }, { $inc: { callsRemaining: -1 } }, { new: true });
        return res;
    }

    async createSession(data: CreateSessionDTO): Promise<ISession | null> {
        const availability = await ExpertAvailability.findOneAndUpdate({ _id: data.availabilityId, isBooked: false }, { isBooked: true }, { new: true });
        if (!availability) {
            throw new Error('Expert Availability not found');
        }
        return await Session.create({ ...data, status: 'upcoming', bookedAt: availability.date, startTime: availability.startTime, endTime: availability.endTime });
    }

    async checkSessionAvailable(expertId: string, availabilityId: string): Promise<ISession | null> {
        return await Session.findOne({ expertId, availabilityId });
    }

    async getSessionsByUser(userId: string): Promise<ISession[] | null> {
        return await Session.find({ userId }).populate('expertId availabilityId');
    }

    async updateSessionStatus(sessionId: string, status: 'completed' | 'missed'): Promise<ISession | null> {
        return await Session.findByIdAndUpdate(sessionId, { status }, { new: true });
    }

    async cancelSession(sessionId: string): Promise<ISession | null> {
        return await Session.findByIdAndUpdate(sessionId, { status: "canceled" }, { new: true });
    }

    async availabityStatus(availabilityId: mongoose.Types.ObjectId): Promise<IExpertAvailability | null> {
        return await ExpertAvailability.findByIdAndUpdate(availabilityId, { isBooked: false }, { new: true });
    }
}

export default OrderRepository;