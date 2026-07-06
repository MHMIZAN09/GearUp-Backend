import { Role } from '../../../generated/prisma/enums';

export interface IAuth {
  name: string;
  email: string;
  password: string;
  contactNumber?: string;
  address?: string;
  profilePhoto?: string;
  role: Role;
}

export interface IAuthLogin {
  email: string;
  password: string;
}
