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

router.get(
  "/get-technician-bookings",
  auth(Role.TECHNICIAN),
  bookingController.getTechnicianBookings
);

router.get(
  "/get-all-bookings",
  auth(Role.ADMIN),
  bookingController.getAllBookings
);

router.get(
  "/get-my-booking-details/:id",
  auth(Role.CUSTOMER),
  bookingController.getMyBookingDetailsById
);

router.get(
  "/get-booking-details/:id",
  auth(Role.ADMIN),
  bookingController.getBookingDetailsById
);

router.patch(
  "/cancel-my-booking/:id",
  auth(Role.CUSTOMER),
  bookingController.cancelMyBooking
);

router.get(
  "/get-technician-booking-details/:id",
  auth(Role.TECHNICIAN),
  bookingController.getTechnicianBookingDetailsById
);

router.patch(
  "/accept-booking/:id",
  auth(Role.TECHNICIAN),
  bookingController.acceptBooking
);

router.patch(
  "/decline-booking/:id",
  auth(Role.TECHNICIAN),
  bookingController.declineBooking
);

router.patch(
  "/mark-booking-in-progress/:id",
  auth(Role.TECHNICIAN),
  bookingController.markBookingInProgress
);

router.patch(
  "/complete-booking/:id",
  auth(Role.TECHNICIAN),
  bookingController.completeBooking
);
export const bookingRoute = router