import { ICourse } from "../../model/admin/courseSchema";
import { IOrder } from "../../model/user/orderSchema";
import { ICourseProgress } from "../../model/user/progressSchema";

interface IOrderService {
    getCourseById(id: string): Promise<ICourse | null>;
    updateCourse(courseId: string, purchasedUsers: string): Promise<ICourse | null>;
    getCourseByUser(userId: string): Promise<ICourse[] | null>;
    
    getOrderById(id: string): Promise<IOrder[] | null>;
    createOrder(order: IOrder): Promise<IOrder | null>;
    getPurchasedByUser(userId: string, courseIds: string): Promise<IOrder | null>;
    checkOrderExisting(id: string): Promise<IOrder | null>;

    getProgressByUser( userId: string): Promise<ICourseProgress[] | null>;
}

export default IOrderService;