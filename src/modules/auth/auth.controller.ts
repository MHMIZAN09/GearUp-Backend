import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { authService } from './auth.service';

const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const user = await authService.registerUserFromDB(payload);

  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: 'User registered successfully',
    data: user,
  });
});
const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const { accessToken, refreshToken } = await authService.loginUserFromDB(payload);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 1000, // 24 hours
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'User logged in successfully',
    data: {
      accessToken,
      refreshToken,
    },
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const user = await authService.getMyProfileFromDB(userId as string);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'User profile fetched successfully',
    data: user,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  // console.log('========== REFRESH HIT ==========');
  // console.log(req.cookies);
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new Error('Refresh token missing');
  }

  const { accessToken } = await authService.refreshTokenFromDB(token);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    // 10 seconds for testing, change to 1 minute in production
    maxAge: 60 * 60 * 24 * 1000, // 24 hours
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Token refreshed successfully',
    data: {
      accessToken,
    },
  });
});

export const authController = {
  registerUser,
  loginUser,
  getMyProfile,
  refreshToken,
};
