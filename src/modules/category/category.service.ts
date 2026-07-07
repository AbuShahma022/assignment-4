import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { ICreateCategory, IUpdateCategory } from "./category.interface";
import httpStatus from "http-status";

const createCategory = async (payload: ICreateCategory) => {
  const isCategoryExist = await prisma.category.findFirst({
    where: {
      name: payload.name,
    },
  });

  if (isCategoryExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Category already exists."
    );
  }

  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

const getAllCategories = async () => {
  const result = await prisma.category.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getSingleCategory = async (categoryId: string) => {
  const result = await prisma.category.findUnique({
    where: {
      id: categoryId,
      status: "ACTIVE",
    },
  });

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Category not found."
    );
  }

  return result;
};

const updateCategory = async (
  categoryId: string,
  payload: IUpdateCategory
) => {
  const isCategoryExist = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!isCategoryExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Category not found."
    );
  }

  if (payload.name) {
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        name: payload.name,
        NOT: {
          id: categoryId,
        },
      },
    });

    if (duplicateCategory) {
      throw new AppError(
        httpStatus.CONFLICT,
        "Category already exists."
      );
    }
  }

  const result = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: payload,
  });

  return result;
};

const deleteCategory = async (categoryId: string) => {
  const isCategoryExist = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!isCategoryExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Category not found."
    );
  }

  if (isCategoryExist.status === "INACTIVE") {
  throw new AppError(
    httpStatus.BAD_REQUEST,
    "Category is already inactive."
  );
}

  const result = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      status: "INACTIVE",
    },
  });

  return result;
};

export const categoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};