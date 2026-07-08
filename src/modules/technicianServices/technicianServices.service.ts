import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { ICreateTechnicianService } from "./technicianservices.interface";
import httpStatus from "http-status";

const createTechnicianService = async (
  userId: string,
  payload: ICreateTechnicianService
) => {
  // Check technician profile exists
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!technicianProfile) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Technician profile not found."
    );
  }

  // Check master service exists
  const service = await prisma.service.findUnique({
    where: {
      id: payload.serviceId,
    },
  });

  if (!service) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Service not found."
    );
  }

  // Check duplicate service
  const isServiceExist = await prisma.technicianService.findFirst({
    where: {
      technicianProfileId: technicianProfile.id,
      serviceId: payload.serviceId,
    },
  });

  if (isServiceExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You have already added this service."
    );
  }

  if (service.status !== "ACTIVE") {
  throw new AppError(
    httpStatus.BAD_REQUEST,
    "This service is currently unavailable."
  );
}

  // Create technician service
  const result = await prisma.technicianService.create({
    data: {
      technicianProfileId: technicianProfile.id,
      serviceId: payload.serviceId,
      price: payload.price,
      description: payload.description,
    },
    include: {
      service: {
        include: {
          category: true,
        },
      },
    },
  });

  return result;
};

const getMyServices = async (userId: string) => {
  // Check technician profile
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!technicianProfile) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Technician profile not found."
    );
  }

  const result = await prisma.technicianService.findMany({
    where: {
      technicianProfileId: technicianProfile.id,
      status: "ACTIVE",
      service: {
      status: "ACTIVE",
    },
    },
    include: {
      service: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getTechnicianServices = async (technicianId: string) => {
  // Check technician exists
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      id: technicianId,
    },
     include: {
    user: {
      select: {
        id: true,
        name: true,
        profileImage: true,
      },
    },
    location: true,
  },
  });

  if (!technician) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Technician not found."
    );
  }

  const result = await prisma.technicianService.findMany({
    where: {
      technicianProfileId: technicianId,
      status: "ACTIVE",
      service: {
        status: "ACTIVE",
      },
    },
    include: {
      service: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
  technician,
  services: result,
};
};

const updateMyService = async (
  userId: string,
  serviceId: string,
  payload: IUpdateTechnicianService
) => {
  // Find technician profile
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!technicianProfile) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Technician profile not found."
    );
  }

  // Check service belongs to technician
  const technicianService = await prisma.technicianService.findFirst({
    where: {
      id: serviceId,
      technicianProfileId: technicianProfile.id,
      status: "ACTIVE",
    },
  });

  if (!technicianService) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Technician service not found."
    );
  }

  const result = await prisma.technicianService.update({
    where: {
      id: serviceId,
    },
    data: payload,
    include: {
      service: {
        include: {
          category: true,
        },
      },
    },
  });

  return result;
};

const deleteMyService = async (
  userId: string,
  serviceId: string
) => {
  // Find technician profile
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!technicianProfile) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Technician profile not found."
    );
  }

  // Check ownership
  const technicianService = await prisma.technicianService.findFirst({
    where: {
      id: serviceId,
      technicianProfileId: technicianProfile.id,
      status: "ACTIVE",
    },
  });

  if (!technicianService) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Technician service not found."
    );
  }

  const result = await prisma.technicianService.update({
    where: {
      id: serviceId,
    },
    data: {
      status: "INACTIVE",
    },
  });

  return result;
};

const getAllTechnicianServices = async () => {
  const result = await prisma.technicianService.findMany({
    include: {
      technicianProfile: {
        include: {
          user: {
            omit: {
              password: true,
            },
          },
          location: true,
        },
      },
      service: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

export const technicianService = {
  createTechnicianService,
  getMyServices,
  getTechnicianServices,
  updateMyService,
  deleteMyService,
  getAllTechnicianServices
};