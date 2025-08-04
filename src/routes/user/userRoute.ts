import { Router } from 'express';

import UserController from '../../controller/user/implementation/userController';
import IUserController from '../../controller/user/IUserController';
import UserService from '../../service/user/implementation/userService';
import UserRepository from '../../repository/user/implementation/userRepository';

import ICourseController from '../../controller/user/ICourseController';
import CourseController from '../../controller/user/implementation/courseController';
import CourseService from '../../service/user/implementation/courseService';
import CourseRepository from '../../repository/user/implementation/courseRepository';

import IOrderController from '../../controller/user/IOrderController';
import OrderController from '../../controller/user/implementation/orderController';
import OrderRepository from '../../repository/user/implementation/orderRepository';
import OrderService from '../../service/user/implementation/orderService';

import { validate } from '../../middleware/Verify';
const router = Router();

const userRepositoryInstance = new UserRepository();
const userServiceInstance = new UserService(userRepositoryInstance);
const userControllerInstance: IUserController = new UserController(userServiceInstance);

const courseRepositoryInstance = new CourseRepository();
const courseServiceInstance = new CourseService(courseRepositoryInstance);
const userCourseController: ICourseController = new CourseController(courseServiceInstance);

const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository, courseRepositoryInstance);
const orderController: IOrderController = new OrderController(orderService);


//------------------------------- register routes -------------------------------

router.post('/register', (req, res) => userControllerInstance.registerPost(req, res));
router.post('/verify-otp', (req, res) => userControllerInstance.verifyOtp(req, res));
router.post('/resend-otp', (req, res) => userControllerInstance.resendOtp(req, res));


//------------------------------- forgot-password -------------------------------

router.post('/forgot-password', (req, res) => userControllerInstance.forgotPassword(req, res))
router.patch('/reset-password', (req, res) => userControllerInstance.resetPassword(req, res))


//--------------------------- Authentification routes ---------------------------

router.post('/login', (req, res) => userControllerInstance.loginPost(req, res));
router.get('/logout', (req, res) => userControllerInstance.logout(req, res));
router.post('/google-login', (req, res) => userControllerInstance.googleLogin(req, res))
router.post('/refresh-token', (req, res) => userControllerInstance.refreshToken(req, res));


//------------------------------------ profile ----------------------------------

router.get('/get-profile', validate("user"), (req, res) => userControllerInstance.getProfile(req, res));
router.post('/update-profile', validate("user"), (req, res) => userControllerInstance.updateProfile(req, res));


//------------------------------------ Course -----------------------------------

router.get('/courses', userCourseController.getCourse.bind(userCourseController));
router.get('/category', userCourseController.getCategory.bind(userCourseController));
router.get('/course/:id', userCourseController.getCoursebyId.bind(userCourseController));
router.get('/check-enrolled/:id', validate("user"), userCourseController.checkEnrolled.bind(userCourseController));
router.get('/course/:courseId/progress', validate("user"), userCourseController.getProgress.bind(userCourseController));
router.post('/course/:courseId/progress', validate("user"), userCourseController.updateProgress.bind(userCourseController));


//--------------------------------- Subscription --------------------------------

router.get('/fetch-plans', (req, res) => userControllerInstance.fetchPlans(req, res));
router.post('/subscription-checkout', validate("user"), (req, res) => orderController.subscriptionCheckout(req, res));
router.get('/check-subscription', validate("user"), (req, res) => userControllerInstance.checkSubscription(req, res));


//------------------------------------ Order ------------------------------------

router.post('/create-checkout-session', validate("user"), (req, res) => orderController.createCheckoutSession(req, res));
router.post('/create-order', validate("user"), (req, res) => orderController.createOrder(req, res));
router.post('/order-failed', validate("user"), (req, res) => orderController.failedOrder(req, res));
router.get('/purchase-history', validate("user"), (req, res) => orderController.getPurchaseHistory(req, res));
router.get('/purchased-courses', validate("user"), (req, res) => orderController.getPurchasedCourse(req, res));


//-------------------------------- Consultation ---------------------------------

router.get('/experts', validate("user"), (req, res) => userControllerInstance.getAllExpert(req, res));
router.get('/expert/:id', validate("user"), (req, res) => userControllerInstance.getExpertById(req, res));
router.get('/expert/:id/availability', validate("user"), (req, res) => userControllerInstance.getExpertAvailability(req, res));


//------------------------------------ Slot -------------------------------------

router.post('/slot-booking', validate("user"), (req, res) => orderController.slotBooking(req, res));
router.get('/sessions', validate("user"), (req, res) => userControllerInstance.getSessions(req, res));

export default router;