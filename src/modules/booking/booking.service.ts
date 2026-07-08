import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import httpStatus from "http-status";
import { ICreateBooking } from "./booking.interface";

const getTechnicianBookingOrThrow = async (
  userId: string,
  bookingId: string
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

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      technicianService: {
        technicianProfileId: technicianProfile.id,
      },
    },
  });

  if (!booking) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Booking not found."
    );
  }

  return booking;
};


const formatBookingAvailability = (
  booking: any
) => ({
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
});
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

const getMyBookingDetailsById = async (
  userId: string,
  bookingId: string
) => {
  const result = await prisma.booking.findFirst({
    where: {
      id: bookingId,
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
  });

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Booking not found."
    );
  }

  return {
    ...result,
    availability: {
      ...result.availability,
      startTime: result.availability.startTime
        .toISOString()
        .substring(11, 16),
      endTime: result.availability.endTime
        .toISOString()
        .substring(11, 16),
    },
  };
};

const cancelMyBooking = async (
  userId: string,
  bookingId: string
) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      customerId: userId,
    },
  });

  if (!booking) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Booking not found."
    );
  }

  if (booking.status !== "REQUESTED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only requested bookings can be cancelled."
    );
  }

  const result = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "CANCELLED",
    },
    include: {
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
      payment: true,
      review: true,
    },
  });

  return {
    ...result,
    availability: {
      ...result.availability,
      startTime: result.availability.startTime
        .toISOString()
        .substring(11, 16),
      endTime: result.availability.endTime
        .toISOString()
        .substring(11, 16),
    },
  };
};

const getTechnicianBookings = async (userId: string) => {
  
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

  const result = await prisma.booking.findMany({
    where: {
      technicianService: {
        technicianProfileId: technicianProfile.id,
      },
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      technicianService: {
        include: {
          service: {
            include: {
              category: true,
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

const getTechnicianBookingDetailsById = async (
  userId: string,
  bookingId: string
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

  // Find booking
  const result = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      technicianService: {
        technicianProfileId: technicianProfile.id,
      },
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      technicianService: {
        include: {
          service: {
            include: {
              category: true,
            },
          },
        },
      },
      availability: true,
      payment: true,
      review: true,
    },
  });

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Booking not found."
    );
  }

  return {
    ...result,
    availability: {
      ...result.availability,
      startTime: result.availability.startTime
        .toISOString()
        .substring(11, 16),
      endTime: result.availability.endTime
        .toISOString()
        .substring(11, 16),
    },
  };
};

const acceptBooking = async (
  userId: string,
  bookingId: string
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

  // Find booking
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      technicianService: {
        technicianProfileId: technicianProfile.id,
      },
    },
  });

  if (!booking) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Booking not found."
    );
  }

  if (booking.status !== "REQUESTED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only requested bookings can be accepted."
    );
  }

  const result = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "ACCEPTED",
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      technicianService: {
        include: {
          service: {
            include: {
              category: true,
            },
          },
        },
      },
      availability: true,
      payment: true,
      review: true,
    },
  });

  return {
    ...result,
    availability: {
      ...result.availability,
      startTime: result.availability.startTime
        .toISOString()
        .substring(11, 16),
      endTime: result.availability.endTime
        .toISOString()
        .substring(11, 16),
    },
  };
};

const declineBooking = async (
  userId: string,
  bookingId: string
) => {
  const booking = await getTechnicianBookingOrThrow(
    userId,
    bookingId
  );

  if (booking.status !== "REQUESTED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only requested bookings can be rejected."
    );
  }

  const result = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "DECLINED",
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      technicianService: {
        include: {
          service: {
            include: {
              category: true,
            },
          },
        },
      },
      availability: true,
      payment: true,
      review: true,
    },
  });

  return formatBookingAvailability(result);
};

const markBookingInProgress = async (
  userId: string,
  bookingId: string
) => {
  const booking = await getTechnicianBookingOrThrow(
    userId,
    bookingId
  );

  if (booking.status !== "ACCEPTED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only accepted bookings can be marked as in progress."
    );
  }

  const result = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "IN_PROGRESS",
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      technicianService: {
        include: {
          service: {
            include: {
              category: true,
            },
          },
        },
      },
      availability: true,
      payment: true,
      review: true,
    },
  });

  return formatBookingAvailability(result);
};

const completeBooking = async (
  userId: string,
  bookingId: string
) => {
  const booking = await getTechnicianBookingOrThrow(
    userId,
    bookingId
  );

  if (booking.status !== "IN_PROGRESS") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only in-progress bookings can be completed."
    );
  }

  const result = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "COMPLETED",
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      technicianService: {
        include: {
          service: {
            include: {
              category: true,
            },
          },
        },
      },
      availability: true,
      payment: true,
      review: true,
    },
  });

  return formatBookingAvailability(result);
};

export const bookingService = {
  createBooking,
  getMyBookings,
  getMyBookingDetailsById,
  cancelMyBooking,
  getTechnicianBookings,
  getTechnicianBookingDetailsById,
  acceptBooking,
  declineBooking,
  markBookingInProgress,
  completeBooking

};