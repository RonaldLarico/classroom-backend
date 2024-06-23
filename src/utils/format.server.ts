import { Student, Prisma } from "@prisma/client"

export type userPick = Pick<
  Student,
  "id" | "user" | "password" | "role">;

export type loginPick = Pick<
  Student,
  "user" | "password">;

export type paginationInfo = {
  limit: number;
  offset: number;
};

export type userInfo = {
  id: number;
  email: string;
  password?: string;
  role: Role;
  iat: number;
};

export type errorProp = {
  errorDescription?: Prisma.PrismaClientKnownRequestError | any;
  errorContent?: string;
  status: number;
  message: string;
};

export type UserData = {
  name: string;
  user: string;
  password: string;
  role: Role;
  groupName: string;
};

export type GroupData = {
  groupName: string;
  date: string;
  link: string
  cycleName: string;
}

export type Role = 'ADMIN' | 'USER';

export interface UserRole {
  id?: number;
  active?: boolean;
  user: string;
  password: string;
  name: string;
  role: Role;
  token?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserUpdate {
  user?: string;
  name?: string;
  role?: Role;
}

export interface UserRegister {
  user: string;
  password: string;
  name: string;
  role: Role;
}
