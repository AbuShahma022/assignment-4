import { UserStatus } from "../../../generated/prisma/enums";

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  profileImage?: string;
  role?: "CUSTOMER" | "TECHNICIAN";
}


export interface IUpdateProfile
  extends Omit<IRegisterUser, "email" | "password"> {}

  export interface IUpdateUserStatus {
  status: UserStatus;
}