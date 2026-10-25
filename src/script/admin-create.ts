import bcrypt from 'bcryptjs';
import { Role, UserStatus } from '../../generated/prisma/client';
import config from '../config';
import { prisma } from '../lib/prisma';

const demoProviderEmail = 'provider.demo@gearup.local';

const hashPassword = (password: string) =>
  bcrypt.hash(password, Number(config.bcrypt_salt_rounds) || 12);

const ensureSuperAdmin = async () => {
  if (!config.supper_admin_email || !config.supper_admin_password) {
    throw new Error('Missing SUPER_ADMIN environment variables');
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: config.supper_admin_email },
    select: { password: true },
  });

  const passwordChanged =
    !existingAdmin ||
    !(await bcrypt.compare(config.supper_admin_password, existingAdmin.password));

  return prisma.user.upsert({
    where: { email: config.supper_admin_email },
    update: {
      name: config.supper_admin_name || 'Admin',
      ...(passwordChanged
        ? { password: await hashPassword(config.supper_admin_password) }
        : {}),
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
    create: {
      name: config.supper_admin_name || 'Admin',
      email: config.supper_admin_email,
      password: await hashPassword(config.supper_admin_password),
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
    select: {
      email: true,
    },
  });
};

const ensureDemoProvider = async () => {
  const providerPassword =
    process.env.SEED_PROVIDER_PASSWORD || config.supper_admin_password;

  if (!providerPassword || providerPassword.length < 12) {
    throw new Error(
      'SEED_PROVIDER_PASSWORD or SUPPER_ADMIN_PASSWORD must be at least 12 characters',
    );
  }

  const existingProvider = await prisma.user.findUnique({
    where: { email: demoProviderEmail },
    select: { password: true },
  });

  const passwordChanged =
    !existingProvider ||
    !(await bcrypt.compare(providerPassword, existingProvider.password));

  return prisma.user.upsert({
    where: { email: demoProviderEmail },
    update: {
      name: 'Adventure Outfitters',
      ...(passwordChanged ? { password: await hashPassword(providerPassword) } : {}),
      role: Role.PROVIDER,
      status: UserStatus.ACTIVE,
      contactNumber: '+8801700000011',
      address: 'Dhanmondi, Dhaka, Bangladesh',
    },
    create: {
      name: 'Adventure Outfitters',
      email: demoProviderEmail,
      password: await hashPassword(providerPassword),
      contactNumber: '+8801700000011',
      address: 'Dhanmondi, Dhaka, Bangladesh',
      role: Role.PROVIDER,
      status: UserStatus.ACTIVE,
    },
    select: {
      email: true,
    },
  });
};

export const seedSuperAdmin = async () => {
  try {
    const [admin, provider] = await Promise.all([
      ensureSuperAdmin(),
      ensureDemoProvider(),
    ]);

    console.log(`Admin ready: ${admin.email}`);
    console.log(`Provider ready: ${provider.email}`);
  } catch (error) {
    console.error('Startup account seed failed:', error);
    throw error;
  }
};
