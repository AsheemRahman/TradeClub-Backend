import { Router } from 'express';

import AdminController from '../../controller/admin/implementation/adminController';
import IAdminController from '../../controller/admin/IAdminController';

import AdminService from '../../service/admin/implementation/adminService';
import AdminRepository from '../../repository/admin/implementation/adminRepository';
import { validate } from '../../middleware/Verify';
import CourseRepository from '../../repository/admin/implementation/courseRepository';
import CourseService from '../../service/admin/implementation/courseService';
import CourseController from '../../controller/admin/implementation/courseController';
import ICourseController from '../../controller/admin/ICourseController';


const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController: IAdminController = new AdminController(adminService);

const courseRepository = new CourseRepository();
const courseService = new CourseService(courseRepository);
const courseController: ICourseController = new CourseController(courseService);


const router = Router();

// ------------------------- Authentification -------------------------

router.post('/login', adminController.adminLogin.bind(adminController))
router.get('/logout', adminController.logout.bind(adminController));


router.post('/refresh-token', adminController.refreshToken.bind(adminController));

// ------------------------------- User -------------------------------

router.get('/get-users', validate("admin"), adminController.getUsers.bind(adminController))
router.patch('/user-status/:id', validate("admin"), adminController.userStatus.bind(adminController))


// ------------------------------- Expert -------------------------------

router.get('/get-experts', validate("admin"), adminController.getExperts.bind(adminController))
router.patch('/expert-status/:id', validate("admin"), adminController.expertStatus.bind(adminController))
router.get('/getExpert/:id', validate("admin"), adminController.expertDetail.bind(adminController))
router.patch('/approve-expert', validate("admin"), adminController.approveExpert.bind(adminController))
router.patch('/decline-expert', validate("admin"), adminController.declineExpert.bind(adminController))


//-------------------------- Category -----------------------------

router.get('/category', validate("admin"), courseController.getCategory.bind(courseController));
router.post('/add-category', validate("admin"), courseController.addCategory.bind(courseController));
router.delete('/delete-category/:id', validate("admin"), courseController.deleteCategory.bind(courseController));
router.patch('/edit-category/:id', validate("admin"), courseController.editCategory.bind(courseController));
// router.patch('/category-status', validate("admin"),);


//-------------------------- Course -----------------------------

router.get('/courses', validate("admin"), );
router.post('/add-course', validate("admin"), );
router.put('/edit-course/:id', validate("admin"), );
router.delete('/delete-course/:id', validate("admin"), );
// router.get('/course', validate("admin"), );




export default router;