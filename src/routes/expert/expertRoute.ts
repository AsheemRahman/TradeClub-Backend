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

router.post('/register', (req, res) => expertControllerInstance.registerPost(req, res));
router.post('/verify-otp', (req, res) => expertControllerInstance.verifyOtp(req, res));
router.post('/resend-otp', (req, res) => expertControllerInstance.resendOtp(req, res));


//--------------------------------- login routes --------------------------------

router.post('/login', (req, res) => expertControllerInstance.loginPost(req, res));
router.get('/logout', (req, res) => expertControllerInstance.logout(req, res));
router.post('/google-login', (req, res) => expertControllerInstance.googleLogin(req, res));

//------------------------------- forgot-password -------------------------------

router.post('/forgot-password', (req, res) => expertControllerInstance.forgotPassword(req, res));
router.patch('/reset-password', (req, res) => expertControllerInstance.resetPassword(req, res));

router.post('/verification', validate(ROLE.EXPERT), (req, res) => expertControllerInstance.expertVerification(req, res));


//------------------------------------ profile ----------------------------------

router.get('/get-expert', validate(ROLE.EXPERT), (req, res) => expertControllerInstance.getExpertData(req, res));
router.post('/update-profile', validate(ROLE.EXPERT), (req, res) => expertControllerInstance.updateProfile(req, res));


//------------------------------------- Slot ------------------------------------

router.get('/slots', validate(ROLE.EXPERT), (req, res) => sessionInstance.getSlots(req, res));
router.post('/add-slot', validate(ROLE.EXPERT), (req, res) => sessionInstance.addSlot(req, res));
router.patch('/edit-slot', validate(ROLE.EXPERT), (req, res) => sessionInstance.editSlot(req, res));
router.delete('/delete-slot/:id', validate(ROLE.EXPERT), (req, res) => sessionInstance.deleteSlot(req, res));


//----------------------------------- Dashboard ---------------------------------

router.get('/dashboard/stats', validate(ROLE.EXPERT), (req, res) => sessionInstance.getDashboardStats(req, res));
router.get('/dashboard/analytics', validate(ROLE.EXPERT), (req, res) => sessionInstance.getSessionAnalytics(req, res));


//------------------------------------ wallet -----------------------------------

router.get('/wallet', validate(ROLE.EXPERT), (req, res) => expertControllerInstance.getWallet(req, res));


//------------------------------------ sessions ----------------------------------

router.get('/sessions', validate(ROLE.EXPERT), (req, res) => sessionInstance.getSessions(req, res));

export default router;