import { ISubscriptionPlan } from "../../model/admin/subscriptionSchema";
import { IOrder } from "../../model/user/orderSchema";
import { IUserSubscription } from "../../model/user/userSubscriptionSchema";


interface IOrderRepository {
    createOrder(order: IOrder): Promise<IOrder | null>;
    getOrderById(id: string): Promise<IOrder[] | null>;
    checkOrderExisting(id: string): Promise<IOrder | null>;
    getPurchasedByUser(userId: string, courseIds: string): Promise<IOrder | null>;

    getPlanById(planId: string): Promise<ISubscriptionPlan | null>;
    checkPlan(userId: string, planId: string): Promise<IUserSubscription[] | null>;
}


export default IOrderRepository;