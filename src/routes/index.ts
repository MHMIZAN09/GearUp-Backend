import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.route';
import { categoryRoutes } from '../modules/category/category.route';
import { gearRoutes } from '../modules/gear/gear.route';
import { paymentRoutes } from '../modules/payment/payment.route';
import { rentalRoutes } from '../modules/rental/rental.route';
import { userRoutes } from '../modules/user/user.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/category', categoryRoutes);
router.use('/gear', gearRoutes);
router.use('/rental', rentalRoutes);
router.use('/payment', paymentRoutes);

export const indexRoutes = router;
