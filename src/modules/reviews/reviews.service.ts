import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { formatBookingAvailability } from "../../utils/formatBooking";
import { ICreateReview, IUpdateReview } from "./reviews.interface";
import httpStatus from "http-status";

const updateTechnicianRating = async (
  technicianProfileId: string
) => {
  const reviews = await prisma.review.findMany({
    where: {
      booking: {
        technicianService: {
          technicianProfileId,
        },
      },
    },
    select: {
      rating: true,
    },
  });

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews === 0
      ? 0
      : reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ) / totalReviews;

  await prisma.technicianProfile.update({
    where: {
      id: technicianProfileId,
    },
    data: {
      averageRating,
      totalReviews,
    },
  });
};

const createReview = async (
  userId: string,
  payload: ICreateReview
) => {
  // Check booking exists
  const booking = await prisma.booking.findFirst({
    where: {
      id: payload.bookingId,
      customerId: userId,
    },
    include: {
      payment: true,
      review: true,
      technicianService: {
        select: {
          technicianProfileId: true,
        },
      },
    },
  });

  if (!booking) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Booking not found."
    );
  }

  // Booking must be completed cz review is only for completed booking
  if (booking.status !== "COMPLETED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can review only completed bookings."
    );
  }

  // checking payment success or not cz after payment technician can accept and after complete customer can review
  if (
    !booking.payment ||
    booking.payment.status !== "SUCCESS"
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment has not been completed."
    );
  }

  // Preventing duplicate review
  if (booking.review) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already reviewed this booking."
    );
  }

  // Create review
  const result = await prisma.review.create({
    data: {
      bookingId: payload.bookingId,
      rating: payload.rating,
      comment: payload.comment,
    },
    include: {
      booking: {
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
          payment: true,
          availability: true,
        },
      },
    },
  });

  await updateTechnicianRating(
    booking.technicianService.technicianProfileId
  );

  return {
    ...result,
    booking: formatBookingAvailability(result.booking),
  };
};

const getMyReviews = async (userId: string) => {
  const result = await prisma.review.findMany({
    where: {
      booking: {
        customerId: userId,
      },
    },
    include: {
      booking: {
        include: {
          payment: true,
          availability: true,
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
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result.map((review) => ({
    ...review,
    booking: formatBookingAvailability(review.booking),
  }));
};

const getMyReviewDetailsById = async (
  userId: string,
  reviewId: string
) => {
  const result = await prisma.review.findFirst({
    where: {
      id: reviewId,
      booking: {
        customerId: userId,
      },
    },
    include: {
      booking: {
        include: {
          payment: true,
          availability: true,
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
        },
      },
    },
  });

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Review not found."
    );
  }

  return {
    ...result,
    booking: formatBookingAvailability(result.booking),
  };
};

const updateMyReview = async (
  userId: string,
  reviewId: string,
  payload: IUpdateReview
) => {
  const review = await prisma.review.findFirst({
    where: {
      id: reviewId,
      booking: {
        customerId: userId,
      },
    },
    include: {
      booking: {
        include: {
          technicianService: {
            select: {
              technicianProfileId: true,
            },
          },
        },
      },
    },
  });

  if (!review) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Review not found."
    );
  }

  const result = await prisma.review.update({
    where: {
      id: reviewId,
    },
    data: payload,
    include: {
      booking: {
        include: {
          payment: true,
          availability: true,
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
        },
      },
    },
  });

  await updateTechnicianRating(
    review.booking.technicianService.technicianProfileId
  );

  return {
    ...result,
    booking: formatBookingAvailability(result.booking),
  };
};

const getTechnicianReviews = async (
  technicianId: string
) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      id: technicianId,
    },
  });

  if (!technician) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Technician not found."
    );
  }

  const result = await prisma.review.findMany({
    where: {
      booking: {
        technicianService: {
          technicianProfileId: technicianId,
        },
      },
    },
    include: {
      booking: {
        include: {
          customer: {
            omit: {
              password: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
  averageRating: technician.averageRating,
  totalReviews: technician.totalReviews,
  reviews: result,
};
};

const getAllReviews = async () => {
  const result = await prisma.review.findMany({
    include: {
      booking: {
        include: {
          customer: {
            omit: {
              password: true,
            },
          },
          payment: true,
          availability: true,
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
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result.map((review) => ({
    ...review,
    booking: formatBookingAvailability(review.booking),
  }));
};

const getReviewDetailsById = async (
  reviewId: string
) => {
  const result = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
    include: {
      booking: {
        include: {
          customer: {
            omit: {
              password: true,
            },
          },
          payment: true,
          availability: true,
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
        },
      },
    },
  });

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Review not found."
    );
  }

  return {
    ...result,
    booking: formatBookingAvailability(result.booking),
  };
};

export const reviewService = {
  createReview,
  getMyReviews,
  getMyReviewDetailsById,
  updateMyReview,
  getTechnicianReviews,
  getAllReviews,
  getReviewDetailsById,
};