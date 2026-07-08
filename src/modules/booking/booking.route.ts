import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import validateZodSchema from "../../middleware/validateRequest";
import { BookingValidation } from "./booking.validation";
import { bookingController } from "./booking.controller";

const router = Router()
router.post(
  "/create-booking",
  auth(Role.CUSTOMER),
  validateZodSchema(BookingValidation.createBookingValidationSchema),
  bookingController.createBooking
);

router.get(
  "/get-my-bookings",
  auth(Role.CUSTOMER),
  bookingController.getMyBookings
);

export const bookingRoute = router