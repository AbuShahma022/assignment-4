import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { ICreateService } from "./MasterService.interface";
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

const getAllServices = async () => {
  const result = await prisma.service.findMany({
    where: {
      status: "ACTIVE",
      category: {
        status: "ACTIVE",
      },
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

export const masterService = {
  createService,
  getAllServices,
};