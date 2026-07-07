import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { IRegisterUser } from "./auth.Interface"
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";

const register = async (payload:IRegisterUser)=> {
   // Check if user already exists
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (isUserExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User already exists with this email."
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcryptSaltRounds)
  );

  // Creating user
  const result = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      phone: payload.phone,
      profileImage: payload.profileImage,

      role: {
        create: {
          role: Role.CUSTOMER,
        },
      },
    },
    include: {
      role: true,
    },
    omit:{
      password: true
    }
  });



  return result;

}


export const authService = {
    register
}