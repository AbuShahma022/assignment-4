import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { ICreateTechnicianProfile } from "./technicianProfile.interface";
import httpStatus from "http-status"
const createTechnicianProfile = async (
  userId: string,
  payload: ICreateTechnicianProfile
) => {
  // Check user exists
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      role: true,
    },
  });

  if (!isUserExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found."
    );
  }

  // Check profile already exists
  const isProfileExist = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });

  if (isProfileExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Technician profile already exists."
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    // Finding first existing location
    let location = await tx.location.findFirst({
      where: {
        country: payload.location.country,
        division: payload.location.division,
        district: payload.location.district,
        area: payload.location.area,
      },
    });

    // Creating location if not exists
    if (!location) {
      location = await tx.location.create({
        data: payload.location,
      });
    }

    // Create technician profile
    const technicianProfile = await tx.technicianProfile.create({
      data: {
        userId,
        locationId: location.id,
        bio: payload.bio,
        experienceYears: payload.experienceYears,
      },
      include: {
        user: {
          omit: {
            password: true,
          },
        },
        location: true,
      },
    });

    // now adding technician role where this person both customer and technician
    const hasTechnicianRole = isUserExist.role.some(
      (item) => item.role === Role.TECHNICIAN
    );

    if (!hasTechnicianRole) {
      await tx.userRole.create({
        data: {
          userId,
          role: Role.TECHNICIAN,
        },
      });
    }

    return technicianProfile;
  },
  {
    timeout: 20000, 
  }

);

  return result;
};
export const technicianProfileService = {
  createTechnicianProfile,
};