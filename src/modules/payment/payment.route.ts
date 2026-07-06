import { Router } from 'express';
import { paymentController } from './payment.controller';

const router = Router();

router.post('/', paymentController.verifyPayment);

export const paymentRoutes = router;
