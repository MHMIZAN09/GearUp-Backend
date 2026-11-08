/** biome-ignore-all lint/style/useConst: <explanation> */
import bcrypt from "bcryptjs";
import crypto from "crypto";
import ejs from "ejs";
import type { TokenPayload } from "google-auth-library";
import type { JwtPayload, SignOptions } from "jsonwebtoken";
import path from "path";
import {
  AuthProvider,
  Role,
  UserStatus,
} from "../../../generated/prisma/enums";
import config from "../../config";
import { googleClient } from "../../lib/googleAuth";
import { transporter } from "../../lib/nodemailer";
import { prisma } from "../../lib/prisma";
import { redisClient } from "../../lib/redis";
import { jwtUtils } from "../../utils/jwt";
import type {
  IAuth,
  IAuthLogin,
  IForgotPasswordPayload,
  IGoogleLoginPayload,
  IRequestUser,
  IResetPasswordPayload,
  IVerifyEmailPayload
} from "./auth.interface";

const sendEmailVerificationOtp = async ({
  name,
  email,
  password,
  role,
}: {
  name: string;
  email: string;
  password?: string;
  role?: Role;
}) => {
  const expirationSeconds = 5 * 60;
  const otpKey = `user-registration-otp:${email}`;
  const otpValue = crypto.randomInt(100000, 1000000).toString();

  if (config.node_env === "development") {
    console.log(`[dev] OTP ${email} : ${otpValue}`);
  }

  await redisClient.set(otpKey, otpValue, {
    expiration: {
      type: "EX",
      value: expirationSeconds,
    },
  });

  if (password && role) {
    const userRegistrationKey = `user-registration-data:${email}`;
    await redisClient.set(
      userRegistrationKey,
      JSON.stringify({ name, email, password, role }),
      {
        expiration: {
          type: "EX",
          value: expirationSeconds,
        },
      },
    );
  }

  const templatePath = path.join(
    process.cwd(),
    "src/templates/registration-user-otp.ejs",
  );

  const templateData = {
    name,
    email,
    otp: otpValue,
    expirationMinutes: expirationSeconds / 60,
  };

  const html = await ejs.renderFile(templatePath, templateData);

  await transporter.sendMail({
    from: config.email_sender,
    to: email,
    subject: "Email Verification",
    html,
  });
};

const registerUser = async (payload: IAuth) => {
  const name = payload.name?.trim();
  const email = payload.email?.trim().toLowerCase();
  const password = payload.password;
  const role = payload.role;

  if (!name || !email || !password || !role) {
    throw new Error("Name, email, password and role are required");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  if (role !== Role.CUSTOMER && role !== Role.PROVIDER) {
    throw new Error("Invalid registration role");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    if (existingUser.status === UserStatus.BLOCKED) {
      throw new Error("User is Blocked");
    }

    if (existingUser.isDeleted) {
      throw new Error("User is Deleted");
    }

    if (existingUser.emailVerified) {
      throw new Error("User Already Exists");
    }

    await sendEmailVerificationOtp({
      name: existingUser.name || name,
      email,
    });

    return;
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds) || 12,
  );

  await sendEmailVerificationOtp({
    name,
    email,
    password: hashedPassword,
    role,
  });
};

const verifyUserEmail = async (payload: IVerifyEmailPayload) => {
  const otp = payload.otp;
  const email = payload.email.trim().toLowerCase();

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist?.status === "BLOCKED") {
    throw new Error("User is Blocked");
  }

  if (isUserExist?.emailVerified) {
    throw new Error("Email ALready Verified");
  }

  if (isUserExist?.isDeleted) {
    throw new Error("User is Deleted");
  }

  const otpKey = `user-registration-otp:${email}`;

  const redisOtp = await redisClient.get(otpKey);

  if (!redisOtp) {
    throw new Error( "Invalid OTP");
  }

  if (redisOtp !== otp) {
    throw new Error("OTP Does Not Match");
  }

  await redisClient.del(otpKey);

  const userRegistrationKey = `user-registration-data:${email}`;
  const redisUserData = await redisClient.get(userRegistrationKey);
  const userPayload: IAuth | null = redisUserData
    ? JSON.parse(redisUserData)
    : null;

  const verifiedUser = isUserExist
    ? await prisma.user.update({
        where: { id: isUserExist.id },
        data: {
          emailVerified: true,
          status: UserStatus.ACTIVE,
        },
        omit: { password: true },
      })
    : userPayload
      ? await prisma.user.create({
          data: {
            name: userPayload.name,
            email: userPayload.email,
            password: userPayload.password,
            role: userPayload.role,
            status: UserStatus.ACTIVE,
            emailVerified: true,
          },
          omit: { password: true },
        })
      : null;

  if (!verifiedUser) {
    throw new Error("User registration data not found");
  }

  await redisClient.del(userRegistrationKey);

  const templatePath = path.join(
    process.cwd(),
    "src/templates/welcome-email.ejs",
  );

  const templateData = {
    name: verifiedUser.name,
  };

  const html = await ejs.renderFile(templatePath, templateData);

  await transporter.sendMail({
    from: config.email_sender,
    to: email,
    subject: "Welcome To GearUp System",
    // text : `Your OTP is ${otp}`
    // html: `<h1>Your OTP is ${otp}</h1>`
    html,
  });

 
  const jwtPayload = {
    userId: verifiedUser.id,
    name: verifiedUser.name,
    email: verifiedUser.email,
    role: verifiedUser.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expiration as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expiration as SignOptions,
  );

  return {
    user: verifiedUser,
    accessToken,
    refreshToken,
  };
};

const loginUser = async (payload: IAuthLogin) => {
  const password = payload.password?.trim();
  const email = payload.email?.trim().toLowerCase();

  if (!email || !password) {
    const error = new Error("Email and password are required") as Error & {
      statusCode?: number;
    };
    error.statusCode = 400;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // throw new Error("User not found");
    const error = new Error("Invalid credentials") as Error & { statusCode?: number };
    error.statusCode = 401;
    throw error;
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new Error("User is Blocked");
  }

  if (user.isDeleted) {
    throw new Error("User is Deleted");
  }

  if (user.password === null && user.googleId !== null) {
    throw new Error("User has account with Google. Please login with Google.");
  }

  if (!user.password) {
    throw new Error("This account does not support password login");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    const error = new Error("Invalid credentials") as Error & { statusCode?: number };
    error.statusCode = 401;
    throw error;
  }

  if (!user.emailVerified) {
    await sendEmailVerificationOtp({
      name: user.name,
      email,
    });
    return { verificationRequired: true as const };
  }

  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expiration as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expiration as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const getMe = async (user: IRequestUser) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    
    omit: {
      password: true,
    },
  });

  if (!isUserExists) {
    throw new Error("User not found");
  }

  return isUserExists;
};

const refreshToken = async (token: string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    token,
    config.jwt_refresh_secret,
  );

  if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
    throw new Error(
      config.node_env === "development"
        ? verifiedRefreshToken.error
        : "Invalid refresh token",
    );
  }

  const data = verifiedRefreshToken.data as JwtPayload;

  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user || user.isDeleted || user.status !== UserStatus.ACTIVE) {
    throw new Error(
      "User is inactive or not found",
    );
  }

  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expiration as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expiration as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const googleLogin = async (payload: IGoogleLoginPayload) => {
  let googleIdTokenPayload: TokenPayload | null | undefined = null;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: payload.idToken,
      audience: config.google_client_id,
    });

    googleIdTokenPayload = ticket.getPayload();
  } catch (error) {
    console.log("Google ID Token Verification Failed", error);
    throw new Error("Invalid Google ID Token");
  }

  if (!googleIdTokenPayload) {
    throw new Error("Invalid Google ID Token");
  }

  if (!googleIdTokenPayload.email) {
    throw new Error("Google Email Not Found");
  }
  if (!googleIdTokenPayload.name) {
    throw new Error("Google Email User Name Not Found");
  }

  const ifUserExistWithGoogleAuth = await prisma.user.findUnique({
    where: {
      email: googleIdTokenPayload.email,
      role: Role.CUSTOMER,
      googleId: googleIdTokenPayload.sub,
    },
  });

  let user = ifUserExistWithGoogleAuth;

  if (!ifUserExistWithGoogleAuth) {
    const ifUserExistWithCredentials = await prisma.user.findUnique({
      where: {
        email: googleIdTokenPayload.email,
        role: Role.CUSTOMER,
        authProvider: AuthProvider.CREDENTIAL,
      },
    });

    if (ifUserExistWithCredentials) {
      if (!ifUserExistWithCredentials.emailVerified) {
        throw new Error("Email Not Verified");
      }

      if (ifUserExistWithCredentials.status === UserStatus.BLOCKED) {
        throw new Error("User Is Blocked");
      }

      if (
        ifUserExistWithCredentials.isDeleted 
        
      ) {
        throw new Error("User Is Deleted");
      }

      user = await prisma.user.update({
        where: {
          id: ifUserExistWithCredentials.id,
        },

        data: {
          googleId: googleIdTokenPayload.sub,
        },
      });
    } else {
      // Google Register
      user = await prisma.user.create({
        data: {
          name: googleIdTokenPayload.name,
          email: googleIdTokenPayload.email,
          role: Role.CUSTOMER,
          googleId: googleIdTokenPayload.sub,
          authProvider: AuthProvider.GOOGLE,
          emailVerified: true,
        },
      });
      const templatePath = path.join(
        process.cwd(),
        "src/templates/welcome-email.ejs",
      );

      const templateData = {
        name: user.name,
      };

      const html = await ejs.renderFile(templatePath, templateData);

      await transporter.sendMail({
        from: config.email_sender,
        to: user.email,
        subject: "Welcome To GearUp System",
        // text : `Your OTP is ${otp}`
        // html: `<h1>Your OTP is ${otp}</h1>`
        html,
      });
    }
  }

  if (!user) {
    throw new Error("User Not Found");
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new Error("User Is Blocked");
  }

  if (user.isDeleted) {
    throw new Error("User Is Deleted");
  }

  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expiration as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expiration as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const forgotPassword = async (payload: IForgotPasswordPayload) => {
  const email = payload.email?.trim().toLowerCase();

  if (!email) {
    throw new Error("Email is required");
  }

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!isUserExist) {
    throw new Error("User Does Not Exist!");
  }

  if (isUserExist.status === "BLOCKED") {
    throw new Error("User is Blocked");
  }

  if (!isUserExist.emailVerified) {
    throw new Error("User Not Verified");
  }

  if (isUserExist.isDeleted ) {
    throw new Error( "User is Deleted");
  }

  if (isUserExist.googleId && isUserExist.authProvider === "GOOGLE") {
    throw new Error("User Has Account With Google");
  }

  const otp = crypto.randomInt(100000, 1000000).toString();

  if (config.node_env === "development")
    console.log(`[dev] Forgot-password OTP for ${email}: ${otp}`);

  const key = `forgot-password-otp:${isUserExist.email}`;

  const expirationSeconds = 5 * 60;

  await redisClient.set(key, otp, {
    expiration: {
      type: "EX",
      value: expirationSeconds,
    },
  });

  const templatePath = path.join(
    process.cwd(),
    "src/templates/forgot-password.ejs",
  );

  const templateData = {
    name: isUserExist.name,
    otp,
    expirationMinutes: expirationSeconds / 60,
  };

  const html = await ejs.renderFile(templatePath, templateData);

  await transporter.sendMail({
    from: config.email_sender,
    to: isUserExist.email,
    subject: "Forgot Password",
    // text : `Your OTP is ${otp}`
    // html: `<h1>Your OTP is ${otp}</h1>`
    html,
  });
};

const resetPassword = async (payload: IResetPasswordPayload) => {
  const email = payload.email?.trim().toLowerCase();
  const otp = payload.otp?.trim();
  const newPassword = payload.newPassword;

  if (!email || !otp || !newPassword) {
    throw new Error("Email, OTP and new password are required");
  }

  if (newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!isUserExist) {
    throw new Error("User Does Not Exist!");
  }

  if (isUserExist.status === "BLOCKED") {
    throw new Error("User is Blocked");
  }

  if (!isUserExist.emailVerified) {
    throw new Error("User Not Verified");
  }

  if (isUserExist.isDeleted ) {
    throw new Error("User is Deleted");
  }

  if (isUserExist.googleId && isUserExist.authProvider === "GOOGLE") {
    throw new Error("User Has Account With Google");
  }

  const key = `forgot-password-otp:${isUserExist.email}`;

  const redisOtp = await redisClient.get(key);

  if (!redisOtp) {
    throw new Error("Invalid OTP");
  }

  if (redisOtp !== otp) {
    throw new Error("OTP Does Not Match");
  }

  const hashedNewPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds) || 12,
  );

  await prisma.user.update({
    where: {
      email: isUserExist.email,
    },
    data: {
      password: hashedNewPassword,
    },
  });

  await redisClient.del([key]);

  const templatePath = path.join(
    process.cwd(),
    "src/templates/reset-password-success.ejs",
  );

  const templateData = {
    name: isUserExist.name,
  };

  const html = await ejs.renderFile(templatePath, templateData);

  await transporter.sendMail({
    from: config.email_sender,
    to: isUserExist.email,
    subject: "Password Changed",
    // text : `Your OTP is ${otp}`
    // html: `<h1>Your Password Is Changed</h1>`
    html,
  });
};

export const authService = {
  registerUser,
  verifyUserEmail,
  loginUser,
  getMe,
  refreshToken,
  googleLogin,
  forgotPassword,
  resetPassword,
};