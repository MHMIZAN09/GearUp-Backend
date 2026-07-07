import express from 'express';
import { Role } from '../../../generated/prisma/client';
import { auth } from '../../middlewares/auth';
import { RentalController } from './rental.controller';

const router = express.Router();
// ? done testing
router.post('/', auth(Role.CUSTOMER), RentalController.createRentalOrder);

router.get('/', auth(Role.CUSTOMER), RentalController.getMyRentalOrders);

router.get('/:id', auth(Role.CUSTOMER), RentalController.getSingleRentalOrder);

router.patch('/:id/cancel', auth(Role.CUSTOMER), RentalController.cancelRentalOrder);

export const rentalRoutes = router;
