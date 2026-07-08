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

const getMyBookingDetailsById = catchAsync(async (req, res) => {
  const result = await bookingService.getMyBookingDetailsById(
    req.user!.id,
    req.params.id as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking details retrieved successfully.",
    data: result,
  });
});

const cancelMyBooking = catchAsync(async (req, res) => {
  const result = await bookingService.cancelMyBooking(
    req.user!.id,
    req.params.id as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking cancelled successfully.",
    data: result,
  });
});

const getTechnicianBookings = catchAsync(async (req, res) => {
  const result = await bookingService.getTechnicianBookings(
    req.user!.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Technician bookings retrieved successfully.",
    data: result,
  });
});

const getTechnicianBookingDetailsById = catchAsync(
  async (req, res) => {
    const result =
      await bookingService.getTechnicianBookingDetailsById(
        req.user!.id,
        req.params.id as string
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Booking details retrieved successfully.",
      data: result,
    });
  }
);

const acceptBooking = catchAsync(async (req, res) => {
  const result = await bookingService.acceptBooking(
    req.user!.id,
    req.params.id as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking accepted successfully.",
    data: result,
  });
});

const declineBooking = catchAsync(async (req, res) => {
  const result = await bookingService.declineBooking(
    req.user!.id,
    req.params.id as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking declined successfully.",
    data: result,
  });
});

const markBookingInProgress = catchAsync(async (req, res) => {
  const result =
    await bookingService.markBookingInProgress(
      req.user!.id,
      req.params.id as string
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking marked as in progress successfully.",
    data: result,
  });
});

const completeBooking = catchAsync(async (req, res) => {
  const result = await bookingService.completeBooking(
    req.user!.id,
    req.params.id as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking completed successfully.",
    data: result,
  });
});

const getAllBookings = catchAsync(async (req, res) => {
  const result = await bookingService.getAllBookings();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All bookings retrieved successfully.",
    data: result,
  });
});

const getBookingDetailsById = catchAsync(async (req, res) => {
  const result = await bookingService.getBookingDetailsById(
    req.params.id as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking details retrieved successfully.",
    data: result,
  });
});

export const bookingController = {
  createBooking,
  getMyBookings,
  getMyBookingDetailsById,
  cancelMyBooking,
  getTechnicianBookings,
  getTechnicianBookingDetailsById,
  acceptBooking,
  declineBooking,
  markBookingInProgress,
  completeBooking,
  getAllBookings,
  getBookingDetailsById

};