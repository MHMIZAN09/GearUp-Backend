import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { auth } from '../../middlewares/auth';
import { reviewController } from './review.controller';

const router = Router();

router.post('/:rentalOrderId', auth(Role.CUSTOMER), reviewController.createReview);

export const reviewRoutes = router;
