import { Router } from 'express';

import IUserController from '../../controller/user/IUserController';

import UserRepository from '../../repository/user/implementation/userRepository';
import UserController from '../../controller/user/implementation/userController';
import UserService from '../../service/user/implementation/userService';

const router = Router();

const userRepositoryInstance = new UserRepository();
const userServiceInstance = new UserService(userRepositoryInstance);
const userControllerInstance: IUserController = new UserController(userServiceInstance);

//------------------------------- register routes -------------------------------

router.post('/register', (req, res) => userControllerInstance.registerPost(req, res));
router.post('/verify-otp', (req, res) => userControllerInstance.verifyOtp(req, res));
router.post('/resend-otp', (req, res) => userControllerInstance.resendOtp(req, res));


//------------------------------- forgot-password-------------------------------

router.post('/forgot-password', (req, res) => userControllerInstance.forgotPassword(req, res))
router.patch('/reset-password', (req, res) => userControllerInstance.resetPassword(req, res))


//--------------------------------- login routes --------------------------------

router.post('/login', (req, res) => userControllerInstance.loginPost(req, res));
// router.post('/logout',  (req, res) =>  userControllerInstance.logout(req, res));














export default router;