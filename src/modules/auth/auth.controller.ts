import type { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type { IRequestUser } from "./auth.interface";
import { authService } from "./auth.service";

const cookieOptions = {
  httpOnly: true,
  secure: config.node_env !== "development",
  sameSite: config.node_env === "development" ? "lax" as const : "none" as const,
  path: "/",
};

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 1000 * 60 * 60 * 24,
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
};

const clearAuthCookies = (res: Response) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
};

const registerUser = catchAsync(async (req: Request, res: Response) => {

  const payload = req.body;

  await authService.registerUser(payload);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Please check your email to verify your account.",
    data: null,
  });
});
const verifyUserEmail = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await authService.verifyUserEmail(payload);

  const { accessToken, refreshToken, user} = result;

  setAuthCookies(res, accessToken, refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Email verified successfully.",
    data: {
      accessToken,
      refreshToken,
      user,
    },
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.loginUser(payload);

  if ("verificationRequired" in result) {
    sendResponse(res, {
      statusCode: httpStatus.FORBIDDEN,
      success: false,
      message: "Email is not verified. A new verification code has been sent to your email.",
      data: null,
    });
    return;
  }

  const { accessToken, refreshToken } = result;

  setAuthCookies(res, accessToken, refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken,
      refreshToken,
    },
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as unknown as IRequestUser;

  if (!user) {
    throw new Error("User not found in request");
  }

  const result = await authService.getMe(user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile fetched successfully",
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  if (!req.cookies.refreshToken) {
    throw new Error("Refresh token is missing");
  }
  const result = await authService.refreshToken(req.cookies.refreshToken);
  const { accessToken, refreshToken: newRefreshToken } = result;

  setAuthCookies(res, accessToken, newRefreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken,
    },
  });
});
const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await authService.googleLogin(payload);

  const { accessToken, refreshToken } = result;

  setAuthCookies(res, accessToken, refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken,
    },
  });
});
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  await authService.forgotPassword(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Password reset link sent to your email: ${payload.email}`,
    data: null,
  });
});


const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  await authService.resetPassword(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully. Please login with your new password.",
    data: null,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  clearAuthCookies(res);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged out successfully.",
    data: null,
  });
});

export const AuthController = {
  registerUser,
  verifyUserEmail,
  loginUser,
  getMe,
  refreshToken,
  googleLogin,
  forgotPassword,
  resetPassword,
  logout,
};