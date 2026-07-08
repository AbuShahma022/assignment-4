import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { ICreateBooking } from "./booking.interface";
import httpStatus from "http-status";

const createBooking = async (
  userId: string,
  payload: ICreateBooking
) => {
  const result = await prisma.$transaction(async (tx) => {
    
    const customer = await tx.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!customer) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Customer not found."
      );
    }

    // Find technician service
    const technicianService = await tx.technicianService.findUnique({
      where: {
        id: payload.technicianServiceId,
      },
      include: {
        technicianProfile: true,
      },
    });

    if (!technicianService) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Technician service not found."
      );
    }

    if (technicianService.status !== "ACTIVE") {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Technician service is unavailable."
      );
    }

    // Find availability
    const availability = await tx.availability.findUnique({
      where: {
        id: payload.availabilityId,
      },
    });

    if (!availability) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Availability not found."
      );
    }

    if (availability.status !== "AVAILABLE") {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Availability is unavailable."
      );
    }

    // Checking availability belongs to technician
    if (
      availability.technicianProfileId !==
      technicianService.technicianProfileId
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Selected availability does not belong to this technician."
      );
    }

    // Prevent duplicate booking on same availability
    const existingBooking = await tx.booking.findFirst({
      where: {
        availabilityId: payload.availabilityId,
        status: {
          in: [
            "REQUESTED",
            "ACCEPTED",
            "IN_PROGRESS",
          ],
        },
      },
    });

    if (existingBooking) {
      throw new AppError(
        httpStatus.CONFLICT,
        "This availability has already been booked."
      );
    }

    // Create booking
    const booking = await tx.booking.create({
      data: {
        customerId: customer.id,
        technicianServiceId: technicianService.id,
        availabilityId: availability.id,
        address: payload.address,
        problemDescription: payload.problemDescription,
        agreedPrice: technicianService.price,
      },
      include: {
        customer: {
          omit: {
            password: true,
          },
        },
        technicianService: {
          include: {
            service: true,
            technicianProfile: {
              include: {
                user: {
                  omit: {
                    password: true,
                  },
                },
              },
            },
          },
        },
        availability: true,
      },
    });

    return booking;
  });

  return result;
};

const getMyBookings = async (userId: string) => {
  const result = await prisma.booking.findMany({
    where: {
      customerId: userId,
    },
    include: {
      technicianService: {
        include: {
          service: {
            include: {
              category: true,
            },
          },
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
        },
      },
      availability: true,
      payment: true,
      review: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result.map((booking) => ({
    ...booking,
    availability: {
      ...booking.availability,
      startTime: booking.availability.startTime
        .toISOString()
        .substring(11, 16),
      endTime: booking.availability.endTime
        .toISOString()
        .substring(11, 16),
    },
  }));
};

export const bookingService = {
  createBooking,
  getMyBookings
};