import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { IRegisterUser, IUpdateProfile, IUpdateUserStatus } from "./user.interface";
import httpStatus  from "http-status";
import bcrypt from "bcryptjs";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
;

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

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      role: true,
      technicianProfile: {
        include: {
          location: true,
        },
      },
    },
    omit: {
      password: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  if (user.status !== "ACTIVE") {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked.");
  }

  return user;
};

const updateMyProfile = async (
  userId: string,
  payload: IUpdateProfile
) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: payload.name,
      phone: payload.phone,
      profileImage: payload.profileImage,
    },
    include: {
      role: true,
    },
    omit: {
      password: true,
    },
  });

  return result;
};

const getAllUser = async () => {
  const result = await prisma.user.findMany({
    include: {
      role: true,
      technicianProfile: true,
    },
    omit: {
      password: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getSingleUser = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      role: true,
      technicianProfile: {
        include: {
          location: true,
        },
      },
    },
    omit: {
      password: true,
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  return result;
};

const updateUserStatus = async (
  userId: string,
  payload: IUpdateUserStatus
) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: payload.status,
    },
    include: {
      role: true,
    },
    omit: {
      password: true,
    },
  });

  return result;
};


export const userService = {
    register,
    getMyProfile,
    updateMyProfile,
    getAllUser,
    getSingleUser,
    updateUserStatus
}