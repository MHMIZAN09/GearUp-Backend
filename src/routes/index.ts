import { Router } from 'express';
import { adminRoutes } from '../modules/admin/admin.route';
import { authRoutes } from '../modules/auth/auth.route';
import { categoryRoutes } from '../modules/category/category.route';
import { gearRoutes } from '../modules/gear/gear.route';
import { paymentRoutes } from '../modules/payment/payment.route';
import { providerRoutes } from '../modules/provider/provider.route';
import { rentalRoutes } from '../modules/rental/rental.route';
import { reviewRoutes } from '../modules/review/review.route';
import { userRoutes } from '../modules/user/user.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/category', categoryRoutes);
router.use('/gear', gearRoutes);
router.use('/rental', rentalRoutes);
router.use('/payment', paymentRoutes);
router.use('/review', reviewRoutes);
router.use('/admin', adminRoutes);
router.use('/provider', providerRoutes);
export const indexRoutes = router;
