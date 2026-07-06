import { Router } from 'express';
import { adminController } from './admin.controller';

const router = Router();

// get all users
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

export const adminRoutes = router;
