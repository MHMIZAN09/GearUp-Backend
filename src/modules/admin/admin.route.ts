import { Router } from 'express';
import { adminController } from './admin.controller';

const router = Router();

// get all users
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

// gears
router.get('/gears', adminController.getAllGears);
router.get('/gears/:id', adminController.getGearById);
router.put('/gears/:id/status', adminController.updateGearStatus);
router.delete('/gears/:id', adminController.deleteGear);

// Rentals
// router.get('/rentals', adminController.getAllRentals);
// router.get('/rentals/:id', adminController.getRentalById);
// router.put('/rentals/:id/status', adminController.updateRentalStatus);
// router.delete('/rentals/:id', adminController.deleteRental);

// reviews
// router.get('/reviews', adminController.getAllReviews);
// router.get('/reviews/:id', adminController.getReviewById);
// router.delete('/reviews/:id', adminController.deleteReview);

// analytics
router.get('/analytics', adminController.getAnalytics);

export const adminRoutes = router;
