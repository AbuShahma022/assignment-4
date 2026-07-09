import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { ILoginUser} from "./auth.Interface"
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import config from "../../config";

import {jwtUtils}  from "../../utils/jwt";
import { JwtPayload, SignOptions } from "jsonwebtoken";



const login = async (payload : ILoginUser)=>{
    // Find user
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    include: {
      role: true,
    },
    omit: {
      password: false,
    },
  });

  // User not found
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  // User blocked
  if (user.status !== "ACTIVE") {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked.");
  }

  // Password check
  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password.");
  }

  // JWT Payload
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    roles: user.role.map((role) => role.role),
  };

  // Access Token
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt.accessTokenSecret,
    config.jwt.accessTokenExpiresIn as SignOptions
  );

  // Refresh Token
  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt.refreshTokenSecret,
    config.jwt.refreshTokenExpiresIn as SignOptions
  );

 

  return {
   accessToken: accessToken,
    refreshToken: refreshToken,
    
  };

}

const refreshToken = async (token: string) => {
  // Verify Refresh Token
  const verifyToken  = jwtUtils.verifyToken(
    token,
    config.jwt.refreshTokenSecret 
  );

  const { userId } = verifyToken.data as JwtPayload;

  // Find User
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      role: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  if (user.status !== "ACTIVE") {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked.");
  }

  // Create JWT Payload
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    roles: user.role.map((role) => role.role),
  };

  // Generate New Access Token
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt.accessTokenSecret,
    config.jwt.accessTokenExpiresIn as SignOptions
  );

  return {
    accessToken,
  };
};

export const authService = {
    
    login,
    refreshToken
}