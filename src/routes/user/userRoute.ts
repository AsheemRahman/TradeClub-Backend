import { Router } from 'express';

import { validate } from '../../middleware/verify';
import { ROLE } from '../../constants/role';

import { orderController, reviewController, userControllerInstance, userCourseController } from '../../di/userDI';


const router = Router();


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

router.get('/get-profile', validate(ROLE.USER), (req, res) => userControllerInstance.getProfile(req, res));
router.post('/update-profile', validate(ROLE.USER), (req, res) => userControllerInstance.updateProfile(req, res));


//------------------------------------ Course -----------------------------------

router.get('/courses', userCourseController.getCourse.bind(userCourseController));
router.get('/category', userCourseController.getCategory.bind(userCourseController));
router.get('/course/:id', userCourseController.getCoursebyId.bind(userCourseController));
router.get('/check-enrolled/:id', validate(ROLE.USER), userCourseController.checkEnrolled.bind(userCourseController));
router.get('/course/:courseId/progress', validate(ROLE.USER), userCourseController.getProgress.bind(userCourseController));
router.post('/course/:courseId/progress', validate(ROLE.USER), userCourseController.updateProgress.bind(userCourseController));


//--------------------------------- Subscription --------------------------------

router.get('/fetch-plans', (req, res) => userControllerInstance.fetchPlans(req, res));
router.post('/subscription-checkout', validate(ROLE.USER), (req, res) => orderController.subscriptionCheckout(req, res));
router.get('/check-subscription', validate(ROLE.USER), (req, res) => userControllerInstance.checkSubscription(req, res));


//------------------------------------ Order ------------------------------------

router.post('/create-checkout-session', validate(ROLE.USER), (req, res) => orderController.createCheckoutSession(req, res));
router.post('/create-order', validate(ROLE.USER), (req, res) => orderController.createOrder(req, res));
router.post('/order-failed', validate(ROLE.USER), (req, res) => orderController.failedOrder(req, res));
router.get('/purchase-history', validate(ROLE.USER), (req, res) => orderController.getPurchaseHistory(req, res));
router.get('/purchased-courses', validate(ROLE.USER), (req, res) => orderController.getPurchasedCourse(req, res));


//-------------------------------- Consultation ---------------------------------

router.get('/experts', validate(ROLE.USER), (req, res) => userControllerInstance.getAllExpert(req, res));
router.get('/expert/:id', validate(ROLE.USER), (req, res) => userControllerInstance.getExpertById(req, res));
router.get('/expert/:id/availability', validate(ROLE.USER), (req, res) => userControllerInstance.getExpertAvailability(req, res));


//------------------------------------ Slot -------------------------------------

router.post('/slot-booking', validate(ROLE.USER), (req, res) => orderController.slotBooking(req, res));
router.get('/sessions', validate(ROLE.USER), (req, res) => userControllerInstance.getSessions(req, res));
router.get('/session/:id', (req, res) => userControllerInstance.getSessionById(req, res));
router.put('/update-session/:id', (req, res) => userControllerInstance.updateSession(req, res));
router.patch('/cancel-session/:id', validate(ROLE.USER), (req, res) => userControllerInstance.cancelSession(req, res));


//------------------------------------ Review -------------------------------------

router.get('/:courseId/reviews', (req, res) => reviewController.getCourseReviews(req, res));
router.post('/:courseId/review', validate(ROLE.USER), (req, res) => reviewController.submitReview(req, res));
router.post('/:courseId/update-review', validate(ROLE.USER), (req, res) => reviewController.updateReview(req, res));

export default router;