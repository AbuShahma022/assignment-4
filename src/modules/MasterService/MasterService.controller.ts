import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { masterService } from "./MasterService.service";
import httpStatus  from "http-status";

const createService = catchAsync(async (req, res) => {
  const result = await masterService.createService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Service created successfully.",
    data: result,
  });
});

const getAllServices = catchAsync(async (req, res) => {
  const result = await masterService.getAllServices();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Services retrieved successfully.",
    data: result,
  });
});

const getSingleService = catchAsync(async (req, res) => {
  const result = await masterService.getSingleService(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service retrieved successfully.",
    data: result,
  });
});

const updateService = catchAsync(async (req, res) => {
  const result = await masterService.updateService(
    req.params.id as string,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service updated successfully.",
    data: result,
  });
});

const deleteService = catchAsync(async (req, res) => {
  const result = await masterService.deleteService(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service deleted successfully.",
    data: result,
  });
});

export const MasterserviceController = {
  createService,
  getAllServices,
  getSingleService,
  updateService,
  deleteService
};