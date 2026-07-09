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

const updateMyService = catchAsync(async (req, res) => {
  const result = await technicianService.updateMyService(
    req.user!.id,
    req.params.id as string,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Technician service updated successfully.",
    data: result,
  });
});

const deleteMyService = catchAsync(async (req, res) => {
  const result = await technicianService.deleteMyService(
    req.user!.id,
    req.params.id as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Technician service deleted successfully.",
    data: result,
  });
});

const getAllTechnicianServices = catchAsync(async (req, res) => {
  const result = await technicianService.getAllTechnicianServices();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All technician services retrieved successfully.",
    data: result,
  });
});

export const technicianServiceController = {
  createTechnicianService,
  getMyServices,
  getTechnicianServices,
  updateMyService,
  deleteMyService,
  getAllTechnicianServices
};