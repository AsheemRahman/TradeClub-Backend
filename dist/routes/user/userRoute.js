"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verify_1 = require("../../middleware/verify");
const role_1 = require("../../constants/role");
const userDI_1 = require("../../di/userDI");
const router = (0, express_1.Router)();
//------------------------------- register routes -------------------------------
router.post('/register', userDI_1.userControllerInstance.registerPost.bind(userDI_1.userControllerInstance));
router.post('/verify-otp', userDI_1.userControllerInstance.verifyOtp.bind(userDI_1.userControllerInstance));
router.post('/resend-otp', userDI_1.userControllerInstance.resendOtp.bind(userDI_1.userControllerInstance));
//------------------------------- forgot-password -------------------------------
router.post('/forgot-password', userDI_1.userControllerInstance.forgotPassword.bind(userDI_1.userControllerInstance));
router.patch('/reset-password', userDI_1.userControllerInstance.resetPassword.bind(userDI_1.userControllerInstance));
//--------------------------- Authentification routes ---------------------------
router.post('/login', userDI_1.userControllerInstance.loginPost.bind(userDI_1.userControllerInstance));
router.get('/logout', userDI_1.userControllerInstance.logout.bind(userDI_1.userControllerInstance));
router.post('/google-login', userDI_1.userControllerInstance.googleLogin.bind(userDI_1.userControllerInstance));
router.post('/refresh-token', userDI_1.userControllerInstance.refreshToken.bind(userDI_1.userControllerInstance));
//------------------------------------ profile ----------------------------------
router.get('/get-profile', (0, verify_1.validate)(role_1.ROLE.USER), userDI_1.userControllerInstance.getProfile.bind(userDI_1.userControllerInstance));
router.post('/update-profile', (0, verify_1.validate)(role_1.ROLE.USER), userDI_1.userControllerInstance.updateProfile.bind(userDI_1.userControllerInstance));
//------------------------------------ Course -----------------------------------
router.get('/courses', userDI_1.userCourseController.getCourse.bind(userDI_1.userCourseController));
router.get('/category', userDI_1.userCourseController.getCategory.bind(userDI_1.userCourseController));
router.get('/course/:id', userDI_1.userCourseController.getCoursebyId.bind(userDI_1.userCourseController));
router.get('/check-enrolled/:id', (0, verify_1.validate)(role_1.ROLE.USER), userDI_1.userCourseController.checkEnrolled.bind(userDI_1.userCourseController));
router.get('/course/:courseId/progress', (0, verify_1.validate)(role_1.ROLE.USER), userDI_1.userCourseController.getProgress.bind(userDI_1.userCourseController));
router.post('/course/:courseId/progress', (0, verify_1.validate)(role_1.ROLE.USER), userDI_1.userCourseController.updateProgress.bind(userDI_1.userCourseController));
//--------------------------------- Subscription --------------------------------
router.get('/fetch-plans', userDI_1.userControllerInstance.fetchPlans.bind(userDI_1.userControllerInstance));
router.post('/subscription-checkout', (0, verify_1.validate)(role_1.ROLE.USER), userDI_1.orderController.subscriptionCheckout.bind(userDI_1.orderController));
router.get('/check-subscription', (0, verify_1.validate)(role_1.ROLE.USER), userDI_1.userControllerInstance.checkSubscription.bind(userDI_1.userControllerInstance));
//------------------------------------ Order ------------------------------------
router.post('/create-checkout-session', (0, verify_1.validate)(role_1.ROLE.USER), userDI_1.orderController.createCheckoutSession.bind(userDI_1.orderController));
router.post('/create-order', (0, verify_1.validate)(role_1.ROLE.USER), userDI_1.orderController.createOrder.bind(userDI_1.orderController));
router.post('/order-failed', (0, verify_1.validate)(role_1.ROLE.USER), userDI_1.orderController.failedOrder.bind(userDI_1.orderController));
router.get('/purchase-history', (0, verify_1.validate)(role_1.ROLE.USER), userDI_1.orderController.getPurchaseHistory.bind(userDI_1.orderController));
router.get('/purchased-courses', (0, verify_1.validate)(role_1.ROLE.USER), userDI_1.orderController.getPurchasedCourse.bind(userDI_1.orderController));
//-------------------------------- Consultation ---------------------------------
router.get('/experts', (0, verify_1.validate)(role_1.ROLE.USER), userDI_1.userControllerInstance.getAllExpert.bind(userDI_1.userControllerInstance));
router.get('/expert/:id', (0, verify_1.validate)(role_1.ROLE.USER), userDI_1.userControllerInstance.getExpertById.bind(userDI_1.userControllerInstance));
router.get('/expert/:id/availability', (0, verify_1.validate)(role_1.ROLE.USER), userDI_1.userControllerInstance.getExpertAvailability.bind(userDI_1.userControllerInstance));
//------------------------------------ Slot -------------------------------------
router.post('/slot-booking', (0, verify_1.validate)(role_1.ROLE.USER), userDI_1.orderController.slotBooking.bind(userDI_1.orderController));
router.get('/sessions', (0, verify_1.validate)(role_1.ROLE.USER), userDI_1.userControllerInstance.getSessions.bind(userDI_1.userControllerInstance));
router.get('/session/:id', userDI_1.userControllerInstance.getSessionById.bind(userDI_1.userControllerInstance));
router.put('/update-session/:id', userDI_1.userControllerInstance.updateSession.bind(userDI_1.userControllerInstance));
router.patch('/cancel-session/:id', (0, verify_1.validate)(role_1.ROLE.USER), userDI_1.userControllerInstance.cancelSession.bind(userDI_1.userControllerInstance));
//------------------------------------ Review -------------------------------------
router.get('/:courseId/reviews', userDI_1.reviewController.getCourseReviews.bind(userDI_1.reviewController));
router.post('/:courseId/review', (0, verify_1.validate)(role_1.ROLE.USER), userDI_1.reviewController.submitReview.bind(userDI_1.reviewController));
router.post('/:courseId/update-review', (0, verify_1.validate)(role_1.ROLE.USER), userDI_1.reviewController.updateReview.bind(userDI_1.reviewController));
exports.default = router;
