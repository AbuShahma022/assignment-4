import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { technicianService } from "./technicianServices.service";
import httpStatus  from "http-status";

const createTechnicianService = catchAsync(async (req, res) => {
  const result = await technicianService.createTechnicianService(
    req.user!.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Technician service created successfully.",
    data: result,
  });
});

const getMyServices = catchAsync(async (req, res) => {
  const result = await technicianService.getMyServices(req.user!.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Technician services retrieved successfully.",
    data: result,
  });
});

const getTechnicianServices = catchAsync(async (req, res) => {
  const result = await technicianService.getTechnicianServices(
    req.params.technicianid as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Technician services retrieved successfully.",
    data: result,
  });
});

export const technicianServiceController = {
  createTechnicianService,
  getMyServices,
  getTechnicianServices
};