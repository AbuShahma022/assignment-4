import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import validateZodSchema from "../../middleware/validateRequest";
import { CategoryValidation } from "./category.validation";
import { categoryController } from "./categroy.controller";

const router = Router()

router.post(
  "/create-category",
  auth(Role.ADMIN),
  validateZodSchema(CategoryValidation.createCategoryValidationSchema),
  categoryController.createCategory
);

router.get(
  "/get-all-categories",
  categoryController.getAllCategories
);

router.get(
  "/get-category/:id",
  categoryController.getSingleCategory
);

router.patch(
  "/update-category/:id",
  auth(Role.ADMIN),
  validateZodSchema(CategoryValidation.updateCategoryValidationSchema),
  categoryController.updateCategory
);

router.delete(
  "/delete-category/:id",
  auth(Role.ADMIN),
  categoryController.deleteCategory
);

export const categoryRoute = router