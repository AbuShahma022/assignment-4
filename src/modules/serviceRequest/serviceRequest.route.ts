import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import validateZodSchema from "../../middleware/validateRequest";
import { serviceRequestValidation } from "./serviceRequest.valiadation";
import { serviceRequestController } from "./serviceRequest.controller";

const router = Router()

router.post(
  "/create-service-request",
  auth(Role.TECHNICIAN),
  validateZodSchema(
    serviceRequestValidation.createServiceRequestValidationSchema
  ),
  serviceRequestController.createServiceRequest
);

router.get(
  "/get-all-service-requests",
  auth(Role.ADMIN),
  serviceRequestController.getAllServiceRequests
);

router.get(
  "/get-my-service-requests",
  auth(Role.TECHNICIAN),
  serviceRequestController.getMyServiceRequests
);

router.get(
  "/get-my-service-request-details/:id",
  auth(Role.TECHNICIAN),
  serviceRequestController.getMyServiceRequestDetailsById
);

router.get(
  "/get-service-request-details/:id",
  auth(Role.ADMIN),
  serviceRequestController.getServiceRequestDetailsById
);

router.patch(
  "/approve-service-request/:id",
  auth(Role.ADMIN),
  serviceRequestController.approveServiceRequest
);

router.patch(
  "/reject-service-request/:id",
  auth(Role.ADMIN),
  validateZodSchema(
    serviceRequestValidation.rejectServiceRequestValidationSchema
  ),
  serviceRequestController.rejectServiceRequest
);

export const serviceRequestRoute = router