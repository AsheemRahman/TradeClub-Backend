import { Router } from 'express';

import { validate } from '../../middleware/verify';
import { ROLE } from '../../constants/role';

import { orderController, reviewController, userControllerInstance, userCourseController } from '../../di/userDI';


const router = Router();


//------------------------------- register routes -------------------------------

router.post('/register',  userControllerInstance.registerPost.bind(userControllerInstance));
router.post('/verify-otp',  userControllerInstance.verifyOtp.bind(userControllerInstance));
router.post('/resend-otp',  userControllerInstance.resendOtp.bind(userControllerInstance));


//------------------------------- forgot-password -------------------------------

router.post('/forgot-password',  userControllerInstance.forgotPassword.bind(userControllerInstance))
router.patch('/reset-password',  userControllerInstance.resetPassword.bind(userControllerInstance))


//--------------------------- Authentification routes ---------------------------

router.post('/login',  userControllerInstance.loginPost.bind(userControllerInstance));
router.get('/logout',  userControllerInstance.logout.bind(userControllerInstance));
router.post('/google-login',  userControllerInstance.googleLogin.bind(userControllerInstance))
router.post('/refresh-token',  userControllerInstance.refreshToken.bind(userControllerInstance));


//------------------------------------ profile ----------------------------------

router.get('/get-profile', validate(ROLE.USER),  userControllerInstance.getProfile.bind(userControllerInstance));
router.post('/update-profile', validate(ROLE.USER),  userControllerInstance.updateProfile.bind(userControllerInstance));


//------------------------------------ Course -----------------------------------

router.get('/courses', userCourseController.getCourse.bind(userCourseController));
router.get('/category', userCourseController.getCategory.bind(userCourseController));
router.get('/course/:id', userCourseController.getCoursebyId.bind(userCourseController));
router.get('/check-enrolled/:id', validate(ROLE.USER), userCourseController.checkEnrolled.bind(userCourseController));
router.get('/course/:courseId/progress', validate(ROLE.USER), userCourseController.getProgress.bind(userCourseController));
router.post('/course/:courseId/progress', validate(ROLE.USER), userCourseController.updateProgress.bind(userCourseController));


//--------------------------------- Subscription --------------------------------

router.get('/fetch-plans',  userControllerInstance.fetchPlans.bind(userControllerInstance));
router.post('/subscription-checkout', validate(ROLE.USER), orderController.subscriptionCheckout.bind(orderController));
router.get('/check-subscription', validate(ROLE.USER),  userControllerInstance.checkSubscription.bind(userControllerInstance));


//------------------------------------ Order ------------------------------------

router.post('/create-checkout-session', validate(ROLE.USER), orderController.createCheckoutSession.bind(orderController));
router.post('/create-order', validate(ROLE.USER), orderController.createOrder.bind(orderController));
router.post('/order-failed', validate(ROLE.USER), orderController.failedOrder.bind(orderController));
router.get('/purchase-history', validate(ROLE.USER), orderController.getPurchaseHistory.bind(orderController));
router.get('/purchased-courses', validate(ROLE.USER), orderController.getPurchasedCourse.bind(orderController));


//-------------------------------- Consultation ---------------------------------

router.get('/experts', validate(ROLE.USER),  userControllerInstance.getAllExpert.bind(userControllerInstance));
router.get('/expert/:id', validate(ROLE.USER),  userControllerInstance.getExpertById.bind(userControllerInstance));
router.get('/expert/:id/availability', validate(ROLE.USER),  userControllerInstance.getExpertAvailability.bind(userControllerInstance));


//------------------------------------ Slot -------------------------------------

router.post('/slot-booking', validate(ROLE.USER), orderController.slotBooking.bind(orderController));
router.get('/sessions', validate(ROLE.USER),  userControllerInstance.getSessions.bind(userControllerInstance));
router.get('/session/:id',  userControllerInstance.getSessionById.bind(userControllerInstance));
router.put('/update-session/:id',  userControllerInstance.updateSession.bind(userControllerInstance));
router.patch('/cancel-session/:id', validate(ROLE.USER),  userControllerInstance.cancelSession.bind(userControllerInstance));


//------------------------------------ Review -------------------------------------

router.get('/:courseId/reviews', reviewController.getCourseReviews.bind(reviewController));
router.post('/:courseId/review', validate(ROLE.USER), reviewController.submitReview.bind(reviewController));
router.post('/:courseId/update-review', validate(ROLE.USER), reviewController.updateReview.bind(reviewController));


export default router;