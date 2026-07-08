import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { auth } from '../../middlewares/auth';
import { reviewController } from './review.controller';

const router = Router();

router.post('/', auth(Role.CUSTOMER), reviewController.createReview);
router.get('/', reviewController.getAllReviews);
router.get('/my-reviews', auth(Role.CUSTOMER), reviewController.getMyReviews);
router.get('/:id', reviewController.getReviewById);
router.delete('/:id', auth(Role.CUSTOMER, Role.ADMIN), reviewController.deleteReview);
export const reviewRoutes = router;
