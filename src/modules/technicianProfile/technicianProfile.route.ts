import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import validateZodSchema from "../../middleware/validateRequest";
import { TechnicianProfileValidation } from "./technicianProfile.validation";
import { technicianProfileController } from "./technicianProfile.controller";

const router = Router()

router.post(
  "/create-technician-profile",
  auth(Role.CUSTOMER),
  validateZodSchema(
    TechnicianProfileValidation.createTechnicianProfileValidationSchema
  ),
  technicianProfileController.createTechnicianProfile
);


export const technicianProfileRoute = router