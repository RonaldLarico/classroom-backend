import { Student, Prisma } from "@prisma/client"

export type userPick = Pick<
  Student,
  "id" | "user" | "password" | "role">;

export type loginPick = Pick<
  Student,
  "user" | "password">;

/* export type updateUserPick = Pick<
  User,
  | "email"
  | "firstName"
  | "lastName"
  | "phone"
  | "role"
>;

export type updatePostPick = Pick<
  Post,
  | "title"
  | "description"
  | "image"
  | "authorId"
  | "createdAt"
>; */

/* export type updateStudentPick = Pick<
  Student,
  | "documentNumber"
  | "name"
  | "activityAcademy"
  | "participation"
  | "institute"
  | "hour"
  | "imageCertificate"
>; */

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

export type Payload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type UserData = {


  name: string;

  user: string;
  password: string;
  role: Role;

};

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
