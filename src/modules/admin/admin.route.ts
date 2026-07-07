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


router.get("/analytics", adminController.getAnalytics);

export const adminRoutes = router;
