import { Router } from 'express';

import { validate } from '../../middleware/Verify';

import IExpertController from '../../controller/expert/IExpertController';
import ExpertRepository from '../../repository/expert/implementation/expertRepository';
import ExpertController from '../../controller/expert/implementation/expertController';
import ExpertService from '../../service/expert/implementation/expertService';

import ProfileRepository from '../../repository/expert/implementation/profileRepository';
import ProfileService from '../../service/expert/implementation/profileService';
import ProfileController from '../../controller/expert/implementation/profilecontroller';
import IProfileController from '../../controller/expert/IProfilecontroller';

const router = Router();

const expertRepositoryInstance = new ExpertRepository();
const expertServiceInstance = new ExpertService(expertRepositoryInstance);
const expertControllerInstance: IExpertController = new ExpertController(expertServiceInstance);

const profileRepositoryInstance = new ProfileRepository();
const profileServiceInstance = new ProfileService(profileRepositoryInstance);
const profileControllerInstance: IProfileController = new ProfileController(profileServiceInstance);

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


router.post('/verification', validate("expert"), (req, res) => expertControllerInstance.expertVerification(req, res))
router.get('/get-expert', validate("expert"), (req, res) => profileControllerInstance.getExpertData(req, res));








export default router;