import bcrypt from 'bcryptjs';
import { Role, UserStatus } from '../../generated/prisma/enums';
import config from '../config';
import { prisma } from '../lib/prisma';

export const seedSuperAdmin = async () => {
  try {
    console.log('🚀 Checking Super Admin...');

    if (!config.supper_admin_email || !config.supper_admin_password) {
      throw new Error('Missing SUPER ADMIN ENV variables');
    }

    const hashPassword = await bcrypt.hash(
      config.supper_admin_password,
      Number(config.bcrypt_salt_rounds) || 10,
    );

    const superAdmin = await prisma.user.upsert({
      where: {
        email: config.supper_admin_email,
      },
      update: {
        name: config.supper_admin_name || 'Admin',
        password: hashPassword,
        role: Role.ADMIN,
        status: UserStatus.ACTIVE,
      },
      create: {
        name: config.supper_admin_name || 'Admin',
        email: config.supper_admin_email,
        password: hashPassword,
        role: Role.ADMIN,
        status: UserStatus.ACTIVE,
      },
    });

    console.log('🎉 Super Admin Ready Successfully');
    console.log({
      id: superAdmin.id,
      name: superAdmin.name,
      email: superAdmin.email,
      role: superAdmin.role,
      status: superAdmin.status,
    });
  } catch (error) {
    console.error('❌ Error seeding super admin:', error);
  }
};
