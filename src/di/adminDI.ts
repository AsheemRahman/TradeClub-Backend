import AdminController from '../controller/admin/implementation/adminController';
import IAdminController from '../controller/admin/IAdminController';
import AdminService from '../service/admin/implementation/adminService';
import AdminRepository from '../repository/admin/implementation/adminRepository';

import CourseRepository from '../repository/admin/implementation/courseRepository';
import CourseService from '../service/admin/implementation/courseService';
import CourseController from '../controller/admin/implementation/courseController';
import ICourseController from '../controller/admin/ICourseController';

import SubscriptionRepository from '../repository/admin/implementation/subscriptionRepository';
import SubscriptionController from '../controller/admin/implementation/subscriptionController';
import ISubscriptionController from '../controller/admin/ISubscriptionController';
import SubscriptionService from '../service/admin/implementation/subscriptionService';


const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController: IAdminController = new AdminController(adminService);


const courseRepository = new CourseRepository();
const courseService = new CourseService(courseRepository);
const courseController: ICourseController = new CourseController(courseService);


const subscriptionRepository = new SubscriptionRepository();
const subscriptionService = new SubscriptionService(subscriptionRepository);
const subscriptionController: ISubscriptionController = new SubscriptionController(subscriptionService);


export {
    adminController,
    courseController,
    subscriptionController,
};