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

router.get(
  "/get-my-reviews",
  auth(Role.CUSTOMER),
  reviewController.getMyReviews
);

router.get(
  "/get-all-reviews",
  auth(Role.ADMIN),
  reviewController.getAllReviews
);

router.get(
  "/get-my-review-details/:id",
  auth(Role.CUSTOMER),
  reviewController.getMyReviewDetailsById
);

router.get(
  "/get-review-details/:id",
  auth(Role.ADMIN),
  reviewController.getReviewDetailsById
);

router.patch(
  "/update-my-review/:id",
  auth(Role.CUSTOMER),
  validateZodSchema(
    reviewValidation.updateReviewValidationSchema
  ),
  reviewController.updateMyReview
);

router.get(
  "/get-technician-reviews/:technicianId",
  reviewController.getTechnicianReviews
);

export const reviewsRoute = router