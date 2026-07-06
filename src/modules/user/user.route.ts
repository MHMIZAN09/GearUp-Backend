import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { auth } from '../../middlewares/auth';
import { userController } from './user.controller';

const router = Router();

router.put(
  '/my-profile',
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  userController.updateMyProfile,
);

export const userRoutes = router;
