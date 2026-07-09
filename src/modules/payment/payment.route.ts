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

router.get(
  "/get-my-payments",
  auth(Role.CUSTOMER),
  paymentController.getMyPayments
);

router.get(
  "/get-all-payments",
  auth(Role.ADMIN),
  paymentController.getAllPayments
);

router.get(
  "/get-my-payment-details/:id",
  auth(Role.CUSTOMER),
  paymentController.getMyPaymentDetailsById
);

router.get(
  "/get-payment-details/:id",
  auth(Role.ADMIN),
  paymentController.getPaymentDetailsById
);


export const paymentRoute = router