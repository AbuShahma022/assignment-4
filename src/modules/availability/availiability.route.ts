import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import validateZodSchema from "../../middleware/validateRequest";
import { AvailabilityValidation } from "./availiability.validation";
import { availabilityController } from "./availiability.controller";

const router = Router()
router.post(
  "/create-availability",
  auth(Role.TECHNICIAN),
  validateZodSchema(
    AvailabilityValidation.createAvailabilityValidationSchema
  ),
  availabilityController.createAvailability
);

router.get(
  "/get-my-availabilities",
  auth(Role.TECHNICIAN),
  availabilityController.getMyAvailabilities
);

export const availabilityRoute = router