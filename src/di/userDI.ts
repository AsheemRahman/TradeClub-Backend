import UserController from '../controller/user/implementation/userController';
import IUserController from '../controller/user/IUserController';
import UserService from '../service/user/implementation/userService';
import UserRepository from '../repository/user/implementation/userRepository';

import ICourseController from '../controller/user/ICourseController';
import CourseController from '../controller/user/implementation/courseController';
import CourseService from '../service/user/implementation/courseService';
import CourseRepository from '../repository/user/implementation/courseRepository';

import IOrderController from '../controller/user/IOrderController';
import OrderController from '../controller/user/implementation/orderController';
import OrderRepository from '../repository/user/implementation/orderRepository';
import OrderService from '../service/user/implementation/orderService';

import EarningRepository from '../repository/expert/implementation/earningRepository';
import ReviewRepository from '../repository/user/implementation/reviewRepository';
import ReviewService from '../service/user/implementation/reviewService';
import ReviewController from '../controller/user/implementation/reviewController';
import IReviewController from '../controller/user/IReviewController';


const courseRepositoryInstance = new CourseRepository();
const courseServiceInstance = new CourseService(courseRepositoryInstance);
const userCourseController: ICourseController = new CourseController(courseServiceInstance);


const orderRepository = new OrderRepository();
const earningRepository = new EarningRepository()
const orderService = new OrderService(orderRepository, courseRepositoryInstance, earningRepository);
const orderController: IOrderController = new OrderController(orderService);


const userRepositoryInstance = new UserRepository();
const userServiceInstance = new UserService(userRepositoryInstance);
const userControllerInstance: IUserController = new UserController(userServiceInstance, orderService);


const reviewRepository = new ReviewRepository();
const reviewService = new ReviewService(reviewRepository);
const reviewController: IReviewController = new ReviewController(reviewService);


export {
    userCourseController,
    orderController,
    userControllerInstance,
    reviewController,
};