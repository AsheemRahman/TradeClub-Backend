import { Router } from 'express';
import { validate } from '../../middleware/verify';

import { ROLE } from '../../constants/role';
import { payoutController } from '../../di/payoutDI';


const router = Router();


// ----------------------------------- Payout -----------------------------------

router.post('/pending', validate(ROLE.ADMIN), payoutController.getPendingPayouts.bind(payoutController))
router.post('/last-payout-date', validate(ROLE.ADMIN), payoutController.getLastPayoutDate.bind(payoutController))
router.post('/run-payouts', validate(ROLE.ADMIN), payoutController.runMonthlyPayouts.bind(payoutController))


export default router;