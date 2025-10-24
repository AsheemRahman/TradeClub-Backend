"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verify_1 = require("../../middleware/verify");
const role_1 = require("../../constants/role");
const adminDI_1 = require("../../di/adminDI");
const router = (0, express_1.Router)();
// ---------------------------- Authentification ------------------------------
router.post('/login', adminDI_1.adminController.adminLogin.bind(adminDI_1.adminController));
router.get('/logout', adminDI_1.adminController.logout.bind(adminDI_1.adminController));
router.post('/refresh-token', adminDI_1.adminController.refreshToken.bind(adminDI_1.adminController));
// ----------------------------------- User ------------------------------------
router.get('/get-users', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.adminController.getUsers.bind(adminDI_1.adminController));
router.get('/user/:id', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.adminController.getUserById.bind(adminDI_1.adminController));
router.patch('/user-status/:id', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.adminController.userStatus.bind(adminDI_1.adminController));
// ----------------------------------- Expert ----------------------------------
router.get('/get-experts', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.adminController.getExperts.bind(adminDI_1.adminController));
router.patch('/expert-status/:id', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.adminController.expertStatus.bind(adminDI_1.adminController));
router.get('/getExpert/:id', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.adminController.expertDetail.bind(adminDI_1.adminController));
router.patch('/approve-expert', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.adminController.approveExpert.bind(adminDI_1.adminController));
router.patch('/decline-expert', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.adminController.declineExpert.bind(adminDI_1.adminController));
//-------------------------------- Category ------------------------------------
router.get('/category', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.courseController.getCategory.bind(adminDI_1.courseController));
router.post('/add-category', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.courseController.addCategory.bind(adminDI_1.courseController));
router.delete('/delete-category/:id', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.courseController.deleteCategory.bind(adminDI_1.courseController));
router.patch('/edit-category/:id', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.courseController.editCategory.bind(adminDI_1.courseController));
// router.patch('/category-status', validate(ROLE.ADMIN),);
//--------------------------------- Course -------------------------------------
router.get('/courses', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.courseController.getCourse.bind(adminDI_1.courseController));
router.get('/course/:id', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.courseController.getCourseById.bind(adminDI_1.courseController));
router.post('/add-course', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.courseController.addCourse.bind(adminDI_1.courseController));
router.put('/edit-course/:id', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.courseController.editCourse.bind(adminDI_1.courseController));
router.delete('/delete-course/:id', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.courseController.deleteCourse.bind(adminDI_1.courseController));
router.patch('/course/:id/toggle-publish', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.courseController.togglePublish.bind(adminDI_1.courseController));
//------------------------------- Subscription ---------------------------------
router.get('/fetch-plans', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.subscriptionController.fetchPlans.bind(adminDI_1.subscriptionController));
router.get('/SubscriptionPlan/:id', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.subscriptionController.getPlanById.bind(adminDI_1.subscriptionController));
router.post('/create-plan', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.subscriptionController.createPlan.bind(adminDI_1.subscriptionController));
router.put('/update-plan/:id', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.subscriptionController.updatePlan.bind(adminDI_1.subscriptionController));
router.delete('/delete-plan/:id', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.subscriptionController.deletePlan.bind(adminDI_1.subscriptionController));
router.patch('/plan-status/:id', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.subscriptionController.planStatus.bind(adminDI_1.subscriptionController));
//---------------------------------- Coupon ------------------------------------
router.get('/coupons', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.subscriptionController.fetchCoupons.bind(adminDI_1.subscriptionController));
router.post('/create-coupon', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.subscriptionController.createCoupon.bind(adminDI_1.subscriptionController));
router.put('/update-coupon/:id', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.subscriptionController.updateCoupon.bind(adminDI_1.subscriptionController));
router.delete('/delete-coupon/:id', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.subscriptionController.deleteCoupon.bind(adminDI_1.subscriptionController));
router.patch('/coupon-status/:id', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.subscriptionController.couponStatus.bind(adminDI_1.subscriptionController));
//---------------------------------- Orders ------------------------------------
router.get('/orders', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.adminController.getOrders.bind(adminDI_1.adminController));
router.get('/revenue', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.adminController.getRevenue.bind(adminDI_1.adminController));
router.get('/stats', (0, verify_1.validate)(role_1.ROLE.ADMIN), adminDI_1.adminController.getStats.bind(adminDI_1.adminController));
exports.default = router;
