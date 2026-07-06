import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { auth } from '../../middlewares/auth';
import { authController } from './auth.controller';

const router = Router();

router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);
router.get('/me', auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER), authController.getMyProfile);

export const authRoutes = router;
