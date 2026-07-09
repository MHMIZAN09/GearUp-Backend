import bcrypt from 'bcryptjs';
import { Role } from '../../generated/prisma/enums';
import config from '../config';
import { prisma } from '../lib/prisma';

export const seedSuperAdmin = async () => {
  try {
    console.log('🚀 Checking Super Admin...');

    if (!config.supper_admin_email || !config.supper_admin_password) {
      throw new Error('Missing SUPER ADMIN ENV variables');
    }

    const existingSuperAdmin = await prisma.user.findFirst({
      where: {
        role: Role.ADMIN,
      },
    });

    if (existingSuperAdmin) {
      console.log('✅ Super Admin already exists. Skipping seed.');
      return;
    }

    const hashPassword = await bcrypt.hash(
      config.supper_admin_password,
      Number(config.bcrypt_salt_rounds) || 10,
    );

    const created = await prisma.user.create({
      data: {
        name: config.supper_admin_name,
        email: config.supper_admin_email,
        password: hashPassword,
        role: Role.ADMIN,
      },
    });

    console.log('🎉 Super Admin Created Successfully');
    console.log(created);
  } catch (error) {
    console.error('❌ Error seeding super admin:', error);

    try {
      await prisma.user.deleteMany({
        where: {
          email: config.supper_admin_email,
        },
      });
    } catch (cleanupError) {
      console.error('⚠️ Cleanup failed:', cleanupError);
    }
  }
};
