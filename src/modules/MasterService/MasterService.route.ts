import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import validateZodSchema from "../../middleware/validateRequest";
import { ServiceValidation } from "./MasterService.validation";
import { MasterserviceController } from "./MasterService.controller";

const router = Router()

router.post(
  "/create-service",
  auth(Role.ADMIN),
  validateZodSchema(ServiceValidation.createServiceValidationSchema),
  MasterserviceController.createService
);

router.get(
  "/get-all-services",
  MasterserviceController.getAllServices
);

router.get(
  "/:id",
  MasterserviceController.getSingleService
);

router.patch(
  "/update-service/:id",
  auth(Role.ADMIN),
  validateZodSchema(ServiceValidation.updateServiceValidationSchema),
  MasterserviceController.updateService
);

router.delete(
  "/delete-service/:id",
  auth(Role.ADMIN),
  MasterserviceController.deleteService
);


export const MasterServiceRoute = router