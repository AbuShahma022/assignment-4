import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { ICreateAvailability } from "./availability.interface";
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

  // Check overlapping availability cz if 9 to 11 and 9:30 to 11:30 can be mistake
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

  return result;
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

export const availabilityService = {
  createAvailability,
  getMyAvailabilities,
};