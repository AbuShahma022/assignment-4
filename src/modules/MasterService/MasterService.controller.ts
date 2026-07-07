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

export const MasterserviceController = {
  createService,
  getAllServices
};