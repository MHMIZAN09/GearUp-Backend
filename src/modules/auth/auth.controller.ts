import { Request, Response } from 'express';
import { authService } from './auth.service';

const registerUser = async (req: Request, res: Response) => {
  const payload = req.body;
  const user = await authService.registerUserFromDB(payload);

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'User registered successfully',
    data: user,
  });
};

const loginUser = async (req: Request, res: Response) => {
  const payload = req.body;
  const { accessToken, refreshToken } = await authService.loginUserFromDB(payload);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'User logged in successfully',
    data: {
      accessToken,
      refreshToken,
    },
  });
};

export const authController = {
  registerUser,
  loginUser,
};
