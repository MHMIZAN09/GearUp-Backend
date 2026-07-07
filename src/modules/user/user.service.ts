import { prisma } from '../../lib/prisma';
import { IUserUpdatePayload } from './user.interface';

const updateMyProfile = async (userId: string, payload: IUserUpdatePayload) => {
  const { name, contactNumber, address, profilePhoto } = payload;
  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      contactNumber,
      address,
      profilePhoto,
    },
    omit: {
      password: true,
    },
  });

  return updateUser;
};

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: {
      password: true,
    },
  });

  return user;
};

export const userService = {
  updateMyProfile,
  getMyProfile,
};
