import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { availabilityService } from "./availability.service";
import httpStatus  from "http-status";

const createAvailability = catchAsync(async (req, res) => {
  const result = await availabilityService.createAvailability(
    req.user!.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Availability created successfully.",
    data: result,
  });
});

const getMyAvailabilities = catchAsync(async (req, res) => {
  const result = await availabilityService.getMyAvailabilities(req.user!.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Availabilities retrieved successfully.",
    data: result,
  });
});

const updateMyAvailability = catchAsync(async (req, res) => {
  const result = await availabilityService.updateMyAvailability(
    req.user!.id,
    req.params.id as string,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Availability updated successfully.",
    data: result,
  });
});

const deleteMyAvailability = catchAsync(async (req, res) => {
  const result = await availabilityService.deleteMyAvailability(
    req.user!.id,
    req.params.id as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Availability deleted successfully.",
    data: result,
  });
});

const getTechnicianAvailabilities = catchAsync(async (req, res) => {
  const result =
    await availabilityService.getTechnicianAvailabilities(
      req.params.id as string
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Technician availabilities retrieved successfully.",
    data: result,
  });
});


export const availabilityController = {
  createAvailability,
  getMyAvailabilities,
  updateMyAvailability,
  deleteMyAvailability,
  getTechnicianAvailabilities,
  
};