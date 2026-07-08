import { Prisma } from "../../../generated/prisma/client";
import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { jwtUtils } from "../../utils/jwt";
import { ICreateTechnicianProfile, IUpdateTechnicianProfile } from "./technicianProfile.interface";
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
    const updatedUser = await tx.user.findUnique({
  where: {
    id: userId,
  },
  include: {
    role: true,
  },
});

const jwtPayload = {
  userId: updatedUser!.id,
  email: updatedUser!.email,
  roles: updatedUser!.role.map((item) => item.role),
};

const tokens = jwtUtils.generateTokens(jwtPayload);

    return {
        technicianProfile,
        tokens

    };
  },
  {
    timeout: 20000, 
  }

);

  return result;
};

const getMyTechnicianProfile = async (userId: string) => {
  const result = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
    include: {
      user: {
        omit: {
          password: true,
        },
        include: {
          role: true,
        },
      },
      location: true,
      technicianServices: {
        include: {
          service: {
            include: {
              category: true,
            },
          },
        },
      },
      availabilities: true,
    },
  });

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Technician profile not found."
    );
  }

  return result;
};

const updateMyTechnicianProfile = async (
  userId: string,
  payload: IUpdateTechnicianProfile
) => {
  // Check profile exists
  const isProfileExist = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
    include: {
      location: true,
    },
  });

  if (!isProfileExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Technician profile not found."
    );
  }

 const result = await prisma.$transaction(async (tx) => {
/*
problem solve here we use share location id for different user. suppose if a and b have same location
id and if anyone change a location and update b location also change. but now first if someone change
location then first search exising location and if exist then change location id to that location id
for update user. that way other user still same location. if not exist then create new location 

*/


  const updateData: Prisma.TechnicianProfileUpdateInput = {
    bio: payload.bio,
    experienceYears: payload.experienceYears,
  };

  // Update location if provided
  if (payload.location) {
    let location = await tx.location.findFirst({
      where: {
        country: payload.location.country,
        division: payload.location.division,
        district: payload.location.district,
        area: payload.location.area,
      },
    });

    if (!location) {
      location = await tx.location.create({
        data: payload.location,
      });
    }

    updateData.location = {
    connect: {
      id: location.id,
    },
  };
  }

  // Update technician profile only once
  await tx.technicianProfile.update({
    where: {
      userId,
    },
    data: updateData,
  });

  // Return updated profile
  const updatedProfile = await tx.technicianProfile.findUnique({
    where: {
      userId,
    },
    include: {
      user: {
        omit: {
          password: true,
        },
        include: {
          role: true,
        },
      },
      location: true,
    },
  });

  return updatedProfile;
});

return result;
  
};

const getAllTechnicians = async () => {
  const result = await prisma.technicianProfile.findMany({
    include: {
      user: {
        omit: {
          password: true,
        },
        include: {
          role: true,
        },
      },
      location: true,
    },
    orderBy: {
      averageRating: "desc",
    },
  });

  return result;
};

const getSingleTechnician = async (technicianId: string) => {
  const result = await prisma.technicianProfile.findUnique({
    where: {
      id: technicianId,
    },
    include: {
      user: {
        omit: {
          password: true,
        },
        include: {
          role: true,
        },
      },
      location: true,
      technicianServices: {
        include: {
          service: {
            include: {
              category: true,
            },
          },
        },
      },
      availabilities: true,
    },
  });

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Technician not found."
    );
  }

  return result;
};

export const technicianProfileService = {
  createTechnicianProfile,
  getMyTechnicianProfile,
  updateMyTechnicianProfile,
  getAllTechnicians,
  getSingleTechnician
};