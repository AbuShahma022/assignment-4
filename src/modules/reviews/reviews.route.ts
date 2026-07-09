import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import validateZodSchema from "../../middleware/validateRequest";
import { reviewValidation } from "./reviews.validation";
import { reviewController } from "./reviews.controller";

const router = Router()

router.post(
  "/create-review",
  auth(Role.CUSTOMER),
  validateZodSchema(
    reviewValidation.createReviewValidationSchema
  ),
  reviewController.createReview
);


export const reviewsRoute = router