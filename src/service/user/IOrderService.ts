import { ICourse } from "../../model/admin/courseSchema";
import { ISubscriptionPlan } from "../../model/admin/subscriptionSchema";
import { IOrder } from "../../model/user/orderSchema";
import { ICourseProgress } from "../../model/user/progressSchema";
import { IUserSubscription } from "../../model/user/userSubscriptionSchema";
import { IOrderInput } from "../../types/IUser";

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
}

export default IOrderService;