import { Router } from 'express';
import PaymentController from '../../controller/shared/implementation/paymentController';

const router = Router();
const paymentController = new PaymentController();

router.post('/create-checkout-session', paymentController.createCheckoutSession.bind(paymentController));

export default router;
