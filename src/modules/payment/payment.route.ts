import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { auth } from '../../middlewares/auth';
import { paymentController } from './payment.controller';

const router = Router();
router.post('/create', auth(Role.CUSTOMER), paymentController.createPayment);
router.post('/', paymentController.verifyPayment);
router.get('/', auth(Role.CUSTOMER), paymentController.getAllPayments);
router.get('/:id', auth(Role.CUSTOMER), paymentController.getPaymentById);

export const paymentRoutes = router;
