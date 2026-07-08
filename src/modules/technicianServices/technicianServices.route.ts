import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import validateZodSchema from "../../middleware/validateRequest";
import { TechnicianServiceValidation } from "./technician.validation";
import { technicianServiceController } from "./technicianServices.controller";

 
 const router = Router()

 router.post(
  "/create-technician-service",
  auth(Role.TECHNICIAN),
  validateZodSchema(
    TechnicianServiceValidation.createTechnicianServiceValidationSchema
  ),
  technicianServiceController.createTechnicianService
);

router.get(
  "/get-my-services",
  auth(Role.TECHNICIAN),
  technicianServiceController.getMyServices
);

router.get(
  "/:technicianid",
  technicianServiceController.getTechnicianServices
);

 export const technicianServicesRoute = router