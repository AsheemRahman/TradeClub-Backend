import { Router } from 'express';
import { validate } from '../../middleware/verify';

import { ROLE } from '../../constants/role';
import { adminController, courseController, subscriptionController } from '../../di/adminDI';


const router = Router();


// ---------------------------- Authentification ------------------------------

router.post('/login', adminController.adminLogin.bind(adminController))
router.get('/logout', adminController.logout.bind(adminController));

router.post('/refresh-token', adminController.refreshToken.bind(adminController));


// ----------------------------------- User ------------------------------------

router.get('/get-users', validate(ROLE.ADMIN), adminController.getUsers.bind(adminController))
router.get('/user/:id', validate(ROLE.ADMIN), adminController.getUserById.bind(adminController))
router.patch('/user-status/:id', validate(ROLE.ADMIN), adminController.userStatus.bind(adminController))


// ----------------------------------- Expert ----------------------------------

router.get('/get-experts', validate(ROLE.ADMIN), adminController.getExperts.bind(adminController))
router.patch('/expert-status/:id', validate(ROLE.ADMIN), adminController.expertStatus.bind(adminController))
router.get('/getExpert/:id', validate(ROLE.ADMIN), adminController.expertDetail.bind(adminController))
router.patch('/approve-expert', validate(ROLE.ADMIN), adminController.approveExpert.bind(adminController))
router.patch('/decline-expert', validate(ROLE.ADMIN), adminController.declineExpert.bind(adminController))


//-------------------------------- Category ------------------------------------

router.get('/category', validate(ROLE.ADMIN), courseController.getCategory.bind(courseController));
router.post('/add-category', validate(ROLE.ADMIN), courseController.addCategory.bind(courseController));
router.delete('/delete-category/:id', validate(ROLE.ADMIN), courseController.deleteCategory.bind(courseController));
router.patch('/edit-category/:id', validate(ROLE.ADMIN), courseController.editCategory.bind(courseController));
// router.patch('/category-status', validate(ROLE.ADMIN),);


//--------------------------------- Course -------------------------------------

router.get('/courses', validate(ROLE.ADMIN), courseController.getCourse.bind(courseController));
router.get('/course/:id', validate(ROLE.ADMIN), courseController.getCourseById.bind(courseController));
router.post('/add-course', validate(ROLE.ADMIN), courseController.addCourse.bind(courseController));
router.put('/edit-course/:id', validate(ROLE.ADMIN), courseController.editCourse.bind(courseController));
router.delete('/delete-course/:id', validate(ROLE.ADMIN), courseController.deleteCourse.bind(courseController));
router.patch('/course/:id/toggle-publish', validate(ROLE.ADMIN), courseController.togglePublish.bind(courseController));


//------------------------------- Subscription ---------------------------------

router.get('/fetch-plans', validate(ROLE.ADMIN), subscriptionController.fetchPlans.bind(subscriptionController) );
router.get('/SubscriptionPlan/:id', validate(ROLE.ADMIN), subscriptionController.getPlanById.bind(subscriptionController));
router.post('/create-plan', validate(ROLE.ADMIN), subscriptionController.createPlan.bind(subscriptionController));
router.put('/update-plan/:id', validate(ROLE.ADMIN),subscriptionController.updatePlan.bind(subscriptionController) );
router.delete('/delete-plan/:id', validate(ROLE.ADMIN),subscriptionController.deletePlan.bind(subscriptionController) );
router.patch('/plan-status/:id', validate(ROLE.ADMIN),subscriptionController.planStatus.bind(subscriptionController) );


//---------------------------------- Coupon ------------------------------------

router.get('/coupons', validate(ROLE.ADMIN), subscriptionController.fetchCoupons.bind(subscriptionController) );
router.post('/create-coupon', validate(ROLE.ADMIN), subscriptionController.createCoupon.bind(subscriptionController));
router.put('/update-coupon/:id', validate(ROLE.ADMIN),subscriptionController.updateCoupon.bind(subscriptionController) );
router.delete('/delete-coupon/:id', validate(ROLE.ADMIN),subscriptionController.deleteCoupon.bind(subscriptionController) );
router.patch('/coupon-status/:id', validate(ROLE.ADMIN),subscriptionController.couponStatus.bind(subscriptionController) );


//---------------------------------- Orders ------------------------------------

router.get('/orders', validate(ROLE.ADMIN), adminController.getOrders.bind(adminController))
router.get('/revenue', validate(ROLE.ADMIN), adminController.getRevenue.bind(adminController))
router.get('/stats', validate(ROLE.ADMIN), adminController.getStats.bind(adminController))



export default router;