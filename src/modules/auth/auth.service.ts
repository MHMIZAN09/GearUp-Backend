import { SignOptions } from 'jsonwebtoken';
import { UserStatus } from '../../../generated/prisma/enums';
import config from '../../config';
import { prisma } from '../../lib/prisma';
import { hashUtil } from '../../utils/hash';
import { jwtUtils } from '../../utils/jwt';
import { IAuth } from './auth.interface';

const registerUserFromDB = async (payload: IAuth) => {
  const { name, email, password, role } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExist) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hashUtil.hashPassword(password, Number(config.bcrypt_salt_rounds));

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

const loginUserFromDB = async (payload: IAuth) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  if (user.status === UserStatus.BLOCKED) {
    throw new Error('User is blocked, please contact support');
  }

  const isMatchPassword = await hashUtil.comparePassword(password, user.password);
  if (!isMatchPassword) {
    throw new Error('Invalid credentials');
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
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

export const authService = {
  registerUserFromDB,
  loginUserFromDB,
};
