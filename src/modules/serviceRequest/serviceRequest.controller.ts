import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { serviceRequestService } from "./serviceRequest.service";
import httpStatus from "http-status";

const createServiceRequest = catchAsync(
  async (req, res) => {
    const result =
      await serviceRequestService.createServiceRequest(
        req.user!.id,
        req.body
      );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Service request created successfully.",
      data: result,
    });
  }
);

const getMyServiceRequests = catchAsync(
  async (req, res) => {
    const result =
      await serviceRequestService.getMyServiceRequests(
        req.user!.id
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        "Service requests retrieved successfully.",
      data: result,
    });
  }
);

const getMyServiceRequestDetailsById = catchAsync(
  async (req, res) => {
    const result =
      await serviceRequestService.getMyServiceRequestDetailsById(
        req.user!.id,
        req.params.id
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        "Service request details retrieved successfully.",
      data: result,
    });
  }
);

export const serviceRequestController = {
  createServiceRequest,
  getMyServiceRequests,
  getMyServiceRequestDetailsById
};