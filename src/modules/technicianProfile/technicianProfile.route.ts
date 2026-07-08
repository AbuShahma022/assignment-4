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

router.get(
  "/get-my-technician-profile",
  auth(Role.TECHNICIAN),
  technicianProfileController.getMyTechnicianProfile
);


router.patch(
  "/update-my-technician-profile",
  auth(Role.TECHNICIAN),
  validateZodSchema(
    TechnicianProfileValidation.updateTechnicianProfileValidationSchema
  ),
  technicianProfileController.updateMyTechnicianProfile
);

router.get(
  "/get-all-technicians",
  technicianProfileController.getAllTechnicians
);

router.get(
  "/:id",
  technicianProfileController.getSingleTechnician
);

export const technicianProfileRoute = router