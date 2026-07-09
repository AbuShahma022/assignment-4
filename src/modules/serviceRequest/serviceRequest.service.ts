import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { ICreateServiceRequest, IRejectServiceRequest } from "./serviceRequest.interface";
import httpStatus from "http-status";

const createServiceRequest = async (
  userId: string,
  payload: ICreateServiceRequest
) => {
  // Check technician profile
  const technicianProfile =
    await prisma.technicianProfile.findUnique({
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

  // Check category
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Category not found."
    );
  }

  // Check existing service
  const existingService = await prisma.service.findFirst({
    where: {
      name: {
        equals: payload.requestedServiceName,
        mode: "insensitive",
      },
    },
  });

  if (existingService) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Service already exists."
    );
  }

  // Prevent duplicate pending request
  const existingRequest =
    await prisma.serviceRequest.findFirst({
      where: {
        technicianProfileId: technicianProfile.id,
        requestedServiceName: {
          equals: payload.requestedServiceName,
          mode: "insensitive",
        },
        status: "PENDING",
      },
    });

  if (existingRequest) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already have a pending request for this service."
    );
  }

  const result = await prisma.serviceRequest.create({
    data: {
      technicianProfileId: technicianProfile.id,
      categoryId: payload.categoryId,
      requestedServiceName: payload.requestedServiceName,
      description: payload.description,
    },
    include: {
      category: true,
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
  });

  return result;
};

const getMyServiceRequests = async (userId: string) => {
  const technicianProfile =
    await prisma.technicianProfile.findUnique({
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

  const result = await prisma.serviceRequest.findMany({
    where: {
      technicianProfileId: technicianProfile.id,
    },
    include: {
      category: true,
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getMyServiceRequestDetailsById = async (
  userId: string,
  serviceRequestId: string
) => {
  const technicianProfile =
    await prisma.technicianProfile.findUnique({
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

  const result = await prisma.serviceRequest.findFirst({
    where: {
      id: serviceRequestId,
      technicianProfileId: technicianProfile.id,
    },
    include: {
      category: true,
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
  });

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Service request not found."
    );
  }

  return result;
};

const getAllServiceRequests = async () => {
  const result = await prisma.serviceRequest.findMany({
    include: {
      category: true,
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getServiceRequestDetailsById = async (
  serviceRequestId: string
) => {
  const result = await prisma.serviceRequest.findUnique({
    where: {
      id: serviceRequestId,
    },
    include: {
      category: true,
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
  });

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Service request not found."
    );
  }

  return result;
};

const approveServiceRequest = async (
  serviceRequestId: string
) => {
  const serviceRequest =
    await prisma.serviceRequest.findUnique({
      where: {
        id: serviceRequestId,
      },
    });

  if (!serviceRequest) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Service request not found."
    );
  }

  if (serviceRequest.status !== "PENDING") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only pending service requests can be approved."
    );
  }

  const result = await prisma.$transaction(
    async (tx) => {

        const existingService = await tx.service.findFirst({
          where: {
            name: {
              equals: serviceRequest.requestedServiceName,
              mode: "insensitive",
            },
          },
        });

        if (existingService) {
          throw new AppError(httpStatus.BAD_REQUEST, "Service already exists.");
        }



      // firest Create Service
      const service = await tx.service.create({
        data: {
          categoryId: serviceRequest.categoryId,
          name: serviceRequest.requestedServiceName,
        },
      });

      // then Create Technician Service
      await tx.technicianService.create({
        data: {
          technicianProfileId:
            serviceRequest.technicianProfileId,
          serviceId: service.id,
        },
      });

      // then hve to Update Request
      const updatedRequest =
        await tx.serviceRequest.update({
          where: {
            id: serviceRequest.id,
          },
          data: {
            status: "APPROVED",
          },
          include: {
            category: true,
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
        });

      return updatedRequest;
    }
  );

  return result;
};

const rejectServiceRequest = async (
  serviceRequestId: string,
  payload: IRejectServiceRequest
) => {
  const serviceRequest =
    await prisma.serviceRequest.findUnique({
      where: {
        id: serviceRequestId,
      },
    });

  if (!serviceRequest) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Service request not found."
    );
  }

  if (serviceRequest.status !== "PENDING") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only pending service requests can be rejected."
    );
  }

  const result = await prisma.serviceRequest.update({
    where: {
      id: serviceRequestId,
    },
    data: {
      status: "REJECTED",
      adminFeedback: payload.adminFeedback,
    },
    include: {
      category: true,
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
  });

  return result;
};


export const serviceRequestService = {
  createServiceRequest,
  getMyServiceRequests,
  getMyServiceRequestDetailsById,
  getAllServiceRequests,
  getServiceRequestDetailsById,
  approveServiceRequest,
  rejectServiceRequest
};