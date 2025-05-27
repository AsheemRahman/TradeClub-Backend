import { RequestHandler, Router } from 'express';

import AdminController from '../../controller/admin/implementation/adminController';
import IAdminController from '../../controller/admin/IAdminController';

import AdminService from '../../service/admin/implementation/adminService';
import AdminRepository from '../../repository/admin/implementation/adminRepository';
import { validate } from '../../middleware/Verify';

const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController: IAdminController = new AdminController(adminService);


const router = Router();

// ------------------------- Authentification -------------------------

router.post('/login', adminController.adminLogin.bind(adminController))
router.get('/logout', adminController.logout.bind(adminController));


// ------------------------------- User -------------------------------

router.get('/get-users', validate("admin"), adminController.getUsers.bind(adminController))
router.patch('/user-status/:id', validate("admin"), adminController.userStatus.bind(adminController))


// ------------------------------- Expert -------------------------------

router.get('/get-experts', validate("admin"), adminController.getExperts.bind(adminController))
router.patch('/expert-status/:id', validate("admin"), adminController.expertStatus.bind(adminController))
router.get('/getExpert/:id', validate("admin"), adminController.expertDetail.bind(adminController))


export default router;