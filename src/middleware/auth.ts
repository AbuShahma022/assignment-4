import {NextFunction} from "express";
import catchAsync from "../utils/catchAsync";
import {Role} from "../../generated/prisma/enums";
import {jwtUtils} from "../utils/jwt";
import config from "../config";
import {JwtPayload} from "jsonwebtoken";
import {prisma} from "../lib/prisma";
import AppError from "../utils/AppError";
import httpStatus from "http-status";

declare global {
  namespace Express {
    interface Request {
      user?: {
        roles: Role[];
        id: string;
        email: string;
      };
    }
  }
}

export const auth = (...requireRole: Role[]) => {
  return catchAsync(async (req, res, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new Error("You are not logged in.please login again to access");
    }

    const data = jwtUtils.verifyToken(token, config.jwt.accessTokenSecret);
   

    const {email, roles, userId} = data.data as JwtPayload;

    if (
      requireRole.length &&
      !roles.some((role: Role) => requireRole.includes(role))
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Forbidden. You don't have permission.",
      );
    }
const user = await prisma.user.findUnique({
  where: {
    id: userId,
  },
});

   if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found.");
    }


     if (user.status === "BLOCKED") {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "User is blocked."
      );
    }
        req.user = {
      id: userId,
      email,
      roles,
    };

    next();
  });
};
