import { IOrder, Order } from "../../../model/user/orderSchema";
import IOrderRepository from "../IOrderRepository";


class OrderRepository implements IOrderRepository {
    async createOrder(order: IOrder): Promise<IOrder | null> {
        const newOrder = await Order.create(order);
        return newOrder;
    };

    async getOrderById(id: string): Promise<IOrder[] | null> {
        const orders = await Order.find({ userId: id }).sort({ createdAt: -1 });;
        return orders;
    };

    async checkOrderExisting(id: string): Promise<IOrder | null> {
        const order = await Order.findOne({ stripeSessionId: id });
        return order;
    };

    async getPurchasedByUser(userId: string, courseId: string): Promise<IOrder | null> {
        const order = await Order.findOne({ userId, itemId: courseId }).lean();
        return order;
    };
}

export default OrderRepository;