import bcrypt from 'bcryptjs';

const hashPassword = async (password: string, saltRounds: number) => {
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const hashUtil = {
  hashPassword,
  comparePassword,
};
