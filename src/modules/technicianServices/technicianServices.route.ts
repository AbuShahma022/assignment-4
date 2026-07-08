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
  "/get-all-technician-services",
  auth(Role.ADMIN),
  technicianServiceController.getAllTechnicianServices
);

router.get(
  "/:technicianid",
  technicianServiceController.getTechnicianServices
);




router.patch(
  "/update-my-service/:id",
  auth(Role.TECHNICIAN),
  validateZodSchema(
    TechnicianServiceValidation.updateTechnicianServiceValidationSchema
  ),
  technicianServiceController.updateMyService
);

router.delete(
  "/delete-my-service/:id",
  auth(Role.TECHNICIAN),
  technicianServiceController.deleteMyService
);


 export const technicianServicesRoute = router