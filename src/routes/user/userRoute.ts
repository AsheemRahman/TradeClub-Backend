import { Router } from 'express';

import UserController from '../../controller/user/implementation/userController';
import IUserController from '../../controller/user/IUserController';
import UserService from '../../service/user/implementation/userService';
import UserRepository from '../../repository/user/implementation/userRepository';

import ICourseController from '../../controller/user/ICourseController';
import CourseController from '../../controller/user/implementation/courseController';
import CourseService from '../../service/user/implementation/courseService';
import CourseRepository from '../../repository/user/implementation/courseRepository';

import { validate } from '../../middleware/Verify';
const router = Router();

const userRepositoryInstance = new UserRepository();
const userServiceInstance = new UserService(userRepositoryInstance);
const userControllerInstance: IUserController = new UserController(userServiceInstance);


const courseRepositoryInstance = new CourseRepository();
const courseServiceInstance = new CourseService(courseRepositoryInstance);
const courseController: ICourseController = new CourseController(courseServiceInstance);

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







export default router;