import { Router } from 'express';
import { validate } from '../../middleware/Verify';

import IExpertController from '../../controller/expert/IExpertController';
import ExpertRepository from '../../repository/expert/implementation/expertRepository';
import ExpertController from '../../controller/expert/implementation/expertController';
import ExpertService from '../../service/expert/implementation/expertService';

import SessionRepository from '../../repository/expert/implementation/sessionRepository';
import SessionService from '../../service/expert/implementation/sessionService';
import SessionController from '../../controller/expert/implementation/sessionController';
import ISessionController from '../../controller/expert/ISessionController';
import { ROLE } from '../../constants/role';

const router = Router();

const expertRepositoryInstance = new ExpertRepository();
const expertServiceInstance = new ExpertService(expertRepositoryInstance);
const expertControllerInstance: IExpertController = new ExpertController(expertServiceInstance);

const sessionRepository = new SessionRepository();
const sessionService = new SessionService(sessionRepository);
const sessionInstance: ISessionController = new SessionController(sessionService);

//------------------------------- register routes -------------------------------

router.post('/register', expertControllerInstance.registerPost.bind(expertControllerInstance));
router.post('/verify-otp', expertControllerInstance.verifyOtp.bind(expertControllerInstance));
router.post('/resend-otp', expertControllerInstance.resendOtp.bind(expertControllerInstance));


//--------------------------------- login routes --------------------------------

router.post('/login', expertControllerInstance.loginPost.bind(expertControllerInstance));
router.get('/logout', expertControllerInstance.logout.bind(expertControllerInstance));
router.post('/google-login', expertControllerInstance.googleLogin.bind(expertControllerInstance));

//------------------------------- forgot-password -------------------------------

router.post('/forgot-password', expertControllerInstance.forgotPassword.bind(expertControllerInstance));
router.patch('/reset-password', expertControllerInstance.resetPassword.bind(expertControllerInstance));

router.post('/verification', validate(ROLE.EXPERT), expertControllerInstance.expertVerification.bind(expertControllerInstance));


//------------------------------------ profile ----------------------------------

router.get('/get-expert', validate(ROLE.EXPERT), expertControllerInstance.getExpertData.bind(expertControllerInstance));
router.post('/update-profile', validate(ROLE.EXPERT), expertControllerInstance.updateProfile.bind(expertControllerInstance));


//------------------------------------- Slot ------------------------------------

router.get('/slots', validate(ROLE.EXPERT), sessionInstance.getSlots.bind(sessionInstance));
router.post('/add-slot', validate(ROLE.EXPERT), sessionInstance.addSlot.bind(sessionInstance));
router.patch('/edit-slot', validate(ROLE.EXPERT), sessionInstance.editSlot.bind(sessionInstance));
router.delete('/delete-slot/:id', validate(ROLE.EXPERT), sessionInstance.deleteSlot.bind(sessionInstance));


//----------------------------------- Dashboard ---------------------------------

router.get('/dashboard/stats', validate(ROLE.EXPERT), sessionInstance.getDashboardStats.bind(sessionInstance));
router.get('/dashboard/analytics', validate(ROLE.EXPERT), sessionInstance.getSessionAnalytics.bind(sessionInstance));


//------------------------------------ wallet -----------------------------------

router.get('/wallet', validate(ROLE.EXPERT), expertControllerInstance.getWallet.bind(expertControllerInstance));


//------------------------------------ sessions ----------------------------------

router.get('/sessions', validate(ROLE.EXPERT), sessionInstance.getSessions.bind(sessionInstance));

export default router;