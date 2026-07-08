import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { ICreateAvailability, IUpdateAvailability } from "./availability.interface";
import httpStatus from "http-status";

const createAvailability = async (
  userId: string,
  payload: ICreateAvailability
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

  // Convert string time to Date cz taking string time
  const startTime = new Date(`1970-01-01T${payload.startTime}:00Z`);
  const endTime = new Date(`1970-01-01T${payload.endTime}:00Z`);

  // Checking if start time < end time
  if (startTime >= endTime) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Start time must be earlier than end time."
    );
  }

  // Check overlapping availability cz if 09 to 11:00 and 9:30 to 11:30 can be mistake
  const overlap = await prisma.availability.findFirst({
    where: {
      technicianProfileId: technicianProfile.id,
      dayOfWeek: payload.dayOfWeek,
      status: "AVAILABLE",

      AND: [
        {
          startTime: {
            lt: endTime,
          },
        },
        {
          endTime: {
            gt: startTime,
          },
        },
      ],
    },
  });

  if (overlap) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Availability overlaps with an existing schedule."
    );
  }

  // Create availability
  const result = await prisma.availability.create({
    data: {
      technicianProfileId: technicianProfile.id,
      dayOfWeek: payload.dayOfWeek,
      startTime,
      endTime,
    },
  });

  return {
  ...result,
  startTime: result.startTime.toISOString().substring(11, 16),
  endTime: result.endTime.toISOString().substring(11, 16),
};
};

const getMyAvailabilities = async (userId: string) => {
  
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

  const result = await prisma.availability.findMany({
    where: {
      technicianProfileId: technicianProfile.id,
      status: "AVAILABLE",
    },
    orderBy: [
      {
        dayOfWeek: "asc",
      },
      {
        startTime: "asc",
      },
    ],
  });

  const formatted = result.map((item) => ({
  ...item,
  startTime: item.startTime.toISOString().substring(11, 16),
  endTime: item.endTime.toISOString().substring(11, 16),
}));

  return formatted;
};

const updateMyAvailability = async (
  userId: string,
  availabilityId: string,
  payload: IUpdateAvailability
) => {
  
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

  
  const availability = await prisma.availability.findFirst({
    where: {
      id: availabilityId,
      technicianProfileId: technicianProfile.id,
      status: "AVAILABLE",
    },
  });

  if (!availability) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Availability not found."
    );
  }

  const dayOfWeek = payload.dayOfWeek ?? availability.dayOfWeek;

  const startTime = payload.startTime
    ? new Date(`1970-01-01T${payload.startTime}:00Z`)
    : availability.startTime;

  const endTime = payload.endTime
    ? new Date(`1970-01-01T${payload.endTime}:00Z`)
    : availability.endTime;

  if (startTime >= endTime) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Start time must be earlier than end time."
    );
  }

  // Check overlap except current availability cz current availiabilty its updating
  const overlap = await prisma.availability.findFirst({
    where: {
      technicianProfileId: technicianProfile.id,
      dayOfWeek,
      status: "AVAILABLE",
      NOT: {
        id: availabilityId,
      },
      AND: [
        {
          startTime: {
            lt: endTime,
          },
        },
        {
          endTime: {
            gt: startTime,
          },
        },
      ],
    },
  });

  if (overlap) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Availability overlaps with an existing schedule."
    );
  }

  const result = await prisma.availability.update({
    where: {
      id: availabilityId,
    },
    data: {
      dayOfWeek,
      startTime,
      endTime,
    },
  });

return {
  ...result,
  startTime: result.startTime.toISOString().substring(11, 16),
  endTime: result.endTime.toISOString().substring(11, 16),
};
};

const deleteMyAvailability = async (
  userId: string,
  availabilityId: string
) => {
  
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

  // Check availability belongs to technician
  const availability = await prisma.availability.findFirst({
    where: {
      id: availabilityId,
      technicianProfileId: technicianProfile.id,
      status: "AVAILABLE",
    },
  });

  if (!availability) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Availability not found."
    );
  }

  const result = await prisma.availability.update({
    where: {
      id: availabilityId,
    },
    data: {
      status: "UNAVAILABLE",
    },
  });

  return {
    ...result,
    startTime: result.startTime.toISOString().substring(11, 16),
    endTime: result.endTime.toISOString().substring(11, 16),
  };
};


const getTechnicianAvailabilities = async (technicianId: string) => {
  
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

  const availabilities = await prisma.availability.findMany({
    where: {
      technicianProfileId: technicianId,
      status: "AVAILABLE",
    },
    orderBy: [
      {
        dayOfWeek: "asc",
      },
      {
        startTime: "asc",
      },
    ],
  });

  const formatted = availabilities.map((item) => ({
    ...item,
    startTime: item.startTime.toISOString().substring(11, 16),
    endTime: item.endTime.toISOString().substring(11, 16),
  }));

  return {
    technician,
    availabilities: formatted,
  };
};


export const availabilityService = {
  createAvailability,
  getMyAvailabilities,
  updateMyAvailability,
  deleteMyAvailability,
  getTechnicianAvailabilities,
  
};