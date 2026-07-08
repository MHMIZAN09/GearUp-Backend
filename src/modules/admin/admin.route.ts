import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { auth } from '../../middlewares/auth';
import { adminController } from './admin.controller';

const router = Router();

// get all users ---done testing
router.get('/users', auth(Role.ADMIN), adminController.getAllUsers);
router.get('/users/:id', auth(Role.ADMIN), adminController.getUserById);
router.put('/users/:id/status', auth(Role.ADMIN), adminController.updateUserStatus);
router.delete('/users/:id', auth(Role.ADMIN), adminController.deleteUser);

// gears
router.get('/gears', auth(Role.ADMIN), adminController.getAllGears);
router.get('/gears/:id', auth(Role.ADMIN), adminController.getGearById);
router.put('/gears/:id/status', auth(Role.ADMIN), adminController.updateGearStatus);
router.delete('/gears/:id', auth(Role.ADMIN), adminController.deleteGear);

// Rentals
router.get('/rentals', auth(Role.ADMIN), adminController.getAllRentals);
router.get('/rentals/:id', auth(Role.ADMIN), adminController.getRentalById);
router.put('/rentals/:id/status', auth(Role.ADMIN), adminController.updateRentalStatus);
router.delete('/rentals/:id', auth(Role.ADMIN), adminController.deleteRental);



// categories -- done testing
router.post('/categories', auth(Role.ADMIN), adminController.createCategory);
router.put('/categories/:id', auth(Role.ADMIN), adminController.updateCategory);
router.delete('/categories/:id', auth(Role.ADMIN), adminController.deleteCategory);

// payments
router.get('/payments', auth(Role.ADMIN), adminController.getAllPayments);
router.get('/payments/:id', auth(Role.ADMIN), adminController.getPaymentById);

// analytics
router.get('/analytics', auth(Role.ADMIN), adminController.getAnalytics);

export const adminRoutes = router;
