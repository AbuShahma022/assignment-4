import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { ICreateService, IGetAllServicesQuery, IUpdateService } from "./MasterService.interface";
import httpStatus from "http-status";

const createService = async (payload: ICreateService) => {
  // Check category exists
  const isCategoryExist = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!isCategoryExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Category not found."
    );
  }

  // Checking duplicate service under the same category
  const isServiceExist = await prisma.service.findFirst({
    where: {
      categoryId: payload.categoryId,
      name: {
      equals: payload.name,
      mode: "insensitive",
    },
    },
  });

  if (isServiceExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Service already exists in this category."
    );
  }

  // Create service
  const result = await prisma.service.create({
    data: payload,
    include: {
      category: true,
    },
  });

  return result;
};

const getAllServices = async (
  query: IGetAllServicesQuery
) => {
  const { search, categoryId } = query;

  const where: Prisma.ServiceWhereInput = {
    status: "ACTIVE",
    category: {
      status: "ACTIVE",
    },
  };

  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  const result = await prisma.service.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getSingleService = async (serviceId: string) => {
  const result = await prisma.service.findFirst({
    where: {
      id: serviceId,
      status: "ACTIVE",
      category: {
        status: "ACTIVE",
      },
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Service not found."
    );
  }

  return result;
};

const updateService = async (
  serviceId: string,
  payload: IUpdateService
) => {
  // Check service exists
  const isServiceExist = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
  });

  if (!isServiceExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Service not found."
    );
  }

  // If category is changing, verify it exists
  if (payload.categoryId) {
    const isCategoryExist = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
      },
    });

    if (!isCategoryExist) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Category not found."
      );
    }
  }

  // Checking duplicate (category + service name) if during update there is same name entry
  if (payload.name || payload.categoryId) {
    const duplicateService = await prisma.service.findFirst({
      where: {
        categoryId: payload.categoryId ?? isServiceExist.categoryId,
        name: payload.name ?? isServiceExist.name,

        NOT: {
          id: serviceId,
        },
      },
    });

    if (duplicateService) {
      throw new AppError(
        httpStatus.CONFLICT,
        "Service already exists in this category."
      );
    }
  }

  const result = await prisma.service.update({
    where: {
      id: serviceId,
    },
    data: payload,
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return result;
};

const deleteService = async (serviceId: string) => {
  const isServiceExist = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
  });

  if (!isServiceExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Service not found."
    );
  }

  if (isServiceExist.status === "INACTIVE") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Service is already inactive."
    );
  }

  const result = await prisma.service.update({
    where: {
      id: serviceId,
    },
    data: {
      status: "INACTIVE",
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return result;
};


export const masterService = {
  createService,
  getAllServices,
  getSingleService,
  updateService,
  deleteService

};