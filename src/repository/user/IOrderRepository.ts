import { IOrder } from "../../model/user/orderSchema";


interface IOrderRepository {
    createOrder(order: IOrder): Promise<IOrder | null>;
    getOrderById(id: string): Promise<IOrder[] | null>;
    checkOrderExisting(id: string): Promise<IOrder | null>;
    getPurchasedByUser(userId: string, courseIds: string): Promise<IOrder | null>;
}


export default IOrderRepository;