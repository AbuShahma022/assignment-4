import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { bookingService } from "./booking.service";
import httpStatus  from "http-status";

const createBooking = catchAsync(async (req, res) => {
  const result = await bookingService.createBooking(
    req.user!.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Booking created successfully.",
    data: result,
  });
});

const getMyBookings = catchAsync(async (req, res) => {
  const result = await bookingService.getMyBookings(req.user!.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My bookings retrieved successfully.",
    data: result,
  });
});

export const bookingController = {
  createBooking,
  getMyBookings
};