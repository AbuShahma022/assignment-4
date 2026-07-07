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

export const MasterServiceRoute = router