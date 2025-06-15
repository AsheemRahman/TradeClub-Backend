import { Router } from 'express';

import IExpertController from '../../controller/expert/IExpertController';

import ExpertRepository from '../../repository/expert/implementation/expertRepository';
import ExpertController from '../../controller/expert/implementation/expertController';
import ExpertService from '../../service/expert/implementation/expertService';

const router = Router();

const expertRepositoryInstance = new ExpertRepository();
const expertServiceInstance = new ExpertService(expertRepositoryInstance);
const expertControllerInstance: IExpertController = new ExpertController(expertServiceInstance);

//------------------------------- register routes -------------------------------

router.post('/register', (req, res) => expertControllerInstance.registerPost(req, res));
router.post('/verify-otp', (req, res) => expertControllerInstance.verifyOtp(req, res));
router.post('/resend-otp', (req, res) => expertControllerInstance.resendOtp(req, res));


//--------------------------------- login routes --------------------------------

router.post('/login', (req, res) => expertControllerInstance.loginPost(req, res));
router.get('/logout', (req, res) => expertControllerInstance.logout(req, res));

//------------------------------- forgot-password-------------------------------

router.post('/forgot-password', (req, res) => expertControllerInstance.forgotPassword(req, res))
router.patch('/reset-password', (req, res) => expertControllerInstance.resetPassword(req, res))


router.post('/verification', (req, res) => expertControllerInstance.expertVerification(req, res))








export default router;