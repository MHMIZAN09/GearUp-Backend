import { UserStatus } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      profilePhoto: true,
      contactNumber: true,
      address: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return users;
};

const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      contactNumber: true,
      profilePhoto: true,
      address: true,
    },
  });
  return user;
};

const updateUserStatus = async (userId: string, status: UserStatus) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status,
    },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      contactNumber: true,
      profilePhoto: true,
      address: true,
    },
  });
  return updatedUser;
};

const deleteUser = async (userId: string) => {
  await prisma.user.delete({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      contactNumber: true,
      profilePhoto: true,
      address: true,
    },
  });
};

export const adminService = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
};
