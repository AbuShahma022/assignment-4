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

export const availabilityController = {
  createAvailability,
  getMyAvailabilities
};