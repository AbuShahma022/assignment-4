import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import validateZodSchema from "../../middleware/validateRequest";
import { paymentValidation } from "./payment.validation";
import { paymentController } from "./payment.controller";

const router = Router()
router.post(
  "/create-checkout-session",
  auth(Role.CUSTOMER),
  validateZodSchema(
    paymentValidation.createCheckoutSessionValidationSchema
  ),
  paymentController.createCheckoutSession
);

router.post(
  "/webhook",paymentController.stripeWebhook
);


export const paymentRoute = router