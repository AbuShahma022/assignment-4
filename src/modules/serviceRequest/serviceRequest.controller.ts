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
        req.params.id as string
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

const getAllServiceRequests = catchAsync(async (req, res) => {
  const result =
    await serviceRequestService.getAllServiceRequests();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All service requests retrieved successfully.",
    data: result,
  });
});

const getServiceRequestDetailsById = catchAsync(
  async (req, res) => {
    const result =
      await serviceRequestService.getServiceRequestDetailsById(
        req.params.id as string
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

const approveServiceRequest = catchAsync(
  async (req, res) => {
    const result =
      await serviceRequestService.approveServiceRequest(
        req.params.id as string
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        "Service request approved successfully.",
      data: result,
    });
  }
);

const rejectServiceRequest = catchAsync(
  async (req, res) => {
    const result =
      await serviceRequestService.rejectServiceRequest(
        req.params.id as string,
        req.body
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        "Service request rejected successfully.",
      data: result,
    });
  }
);

export const serviceRequestController = {
  createServiceRequest,
  getMyServiceRequests,
  getMyServiceRequestDetailsById,
  getAllServiceRequests,
  getServiceRequestDetailsById,
  approveServiceRequest,
  rejectServiceRequest
};