import { ICourse } from "../../../model/admin/courseSchema";
import { ISubscriptionPlan } from "../../../model/admin/subscriptionSchema";
import { IOrder } from "../../../model/user/orderSchema";
import { ICourseProgress } from "../../../model/user/progressSchema";
import { IUserSubscription } from "../../../model/user/userSubscriptionSchema";
import ICourseRepository from "../../../repository/user/ICourseRepository";
import IOrderRepository from "../../../repository/user/IOrderRepository";
import { IOrderInput } from "../../../types/IUser";
import IOrderService from "../IOrderService";


class OrderService implements IOrderService {
    private orderRepository: IOrderRepository;
    private courseRepository: ICourseRepository;

    constructor(orderRepository: IOrderRepository, courseRepository: ICourseRepository) {
        this.orderRepository = orderRepository;
        this.courseRepository = courseRepository;
    };

    async getCourseById(id: string): Promise<ICourse | null> {
        const Course = await this.courseRepository.getCourseById(id);
        return Course;
    }

    async updateCourse(courseId: string, purchasedUsers: string): Promise<ICourse | null> {
        const Courses = await this.courseRepository.updateCourse(courseId, purchasedUsers);
        return Courses;
    }

    async getCourseByUser(userId: string): Promise<ICourse[] | null> {
        const Courses = await this.courseRepository.getCourseByUser(userId);
        return Courses;
    }

    async getProgressByUser(userId: string): Promise<ICourseProgress[] | null> {
        const Courses = await this.courseRepository.getAllProgress(userId);
        return Courses;
    }

    async createOrder(order: IOrderInput): Promise<IOrder | null> {
        const newOrder = await this.orderRepository.createOrder(order);
        return newOrder;
    }

    async getOrderById(id: string): Promise<IOrder[] | null> {
        const Course = await this.orderRepository.getOrderById(id);
        return Course;
    }

    async checkOrderExisting(id: string): Promise<IOrder | null> {
        const order = await this.orderRepository.checkOrderExisting(id);
        return order;
    }

    async getPurchasedByUser(userId: string, courseId: string): Promise<IOrder | null> {
        const order = await this.orderRepository.getPurchasedByUser(userId, courseId);
        return order;
    }

    async getPlanById(planId: string): Promise<ISubscriptionPlan | null> {
        const planData = await this.orderRepository.getPlanById(planId);
        return planData;
    }

    async checkPlan(userId: string, planId: string): Promise<IUserSubscription[] | null> {
        const Data = await this.orderRepository.checkPlan(userId, planId);
        return Data;
    }
}


export default OrderService;