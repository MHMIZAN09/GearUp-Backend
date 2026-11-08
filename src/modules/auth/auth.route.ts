import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { auth } from '../../middlewares/auth';
import { AuthController } from './auth.controller';

const router = Router();


router.post(
  "/register",
  AuthController.registerUser,
);
router.post(
  "/verify-email",
  AuthController.verifyUserEmail,
);

router.post(
    "/login",
  AuthController.loginUser,
);


router.get(
  "/me",
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  // validateRequest
  AuthController.getMe,
);



router.post("/refresh-token", AuthController.refreshToken);
router.post("/google", AuthController.googleLogin);
router.post(
  "/forgot-password",
    AuthController.forgotPassword,
);


router.post(
  "/reset-password",
 
  AuthController.resetPassword,
);
router.post("/logout", AuthController.logout);

export const authRoutes = router;
