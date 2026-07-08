import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { auth } from '../../middlewares/auth';
import { userController } from './user.controller';

const router = Router();

// done testing
router.put(
  '/my-profile',
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  userController.updateMyProfile,
);

router.get(
  '/my-profile',
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  userController.getMyProfile,
);

router.get('/analytics', auth(Role.CUSTOMER), userController.getMyAnalytics);
export const userRoutes = router;
