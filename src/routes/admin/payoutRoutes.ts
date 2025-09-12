import { Router } from 'express';
import { validate } from '../../middleware/Verify';

import PayoutService from '../../service/admin/implementation/payoutService';
import PayoutController from '../../controller/admin/implementation/payoutController';
import IPayoutController from '../../controller/admin/IPayoutController';
import EarningRepository from '../../repository/expert/implementation/earningRepository';
import ExpertRepository from '../../repository/expert/implementation/expertRepository';

const expertRepository = new ExpertRepository();
const earningRepository = new EarningRepository();
const payoutService = new PayoutService(expertRepository, earningRepository);
const payoutController: IPayoutController = new PayoutController(payoutService);


const router = Router();


// ----------------------------------- Payout -----------------------------------

router.post('/pending', validate("admin"), payoutController.getPendingPayouts.bind(payoutController))
router.post('/last-payout-date', validate("admin"), payoutController.getLastPayoutDate.bind(payoutController))
router.post('/run-payouts', validate("admin"), payoutController.runMonthlyPayouts.bind(payoutController))



export default router;