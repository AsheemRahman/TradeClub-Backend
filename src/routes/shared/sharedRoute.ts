import { Router } from 'express';
import PaymentController from '../../controller/shared/implementation/paymentController';
import { validate } from '../../middleware/Verify';

const router = Router();
const paymentController = new PaymentController();

router.post('/create-checkout-session', validate("user"), paymentController.createCheckoutSession.bind(paymentController));

export default router;
