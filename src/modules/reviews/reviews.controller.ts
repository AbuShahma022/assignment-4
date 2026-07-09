import { get } from "node:http";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { reviewService } from "./reviews.service";
import httpStatus  from "http-status";

const createReview = catchAsync(async (req, res) => {
  const result = await reviewService.createReview(
    req.user!.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review created successfully.",
    data: result,
  });
});

const getMyReviews = catchAsync(async (req, res) => {
  const result = await reviewService.getMyReviews(
    req.user!.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrieved successfully.",
    data: result,
  });
});

const getMyReviewDetailsById = catchAsync(
  async (req, res) => {
    const result =
      await reviewService.getMyReviewDetailsById(
        req.user!.id,
        req.params.id
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Review details retrieved successfully.",
      data: result,
    });
  }
);

const updateMyReview = catchAsync(async (req, res) => {
  const result = await reviewService.updateMyReview(
    req.user!.id,
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review updated successfully.",
    data: result,
  });
});

const getTechnicianReviews = catchAsync(async (req, res) => {
  const result = await reviewService.getTechnicianReviews(
    req.params.technicianId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Technician reviews retrieved successfully.",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req, res) => {
  const result = await reviewService.getAllReviews();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All reviews retrieved successfully.",
    data: result,
  });
});

const getReviewDetailsById = catchAsync(
  async (req, res) => {
    const result =
      await reviewService.getReviewDetailsById(
        req.params.id as string
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        "Review details retrieved successfully.",
      data: result,
    });
  }
);

export const reviewController = {
  createReview,
  getMyReviews,
  getMyReviewDetailsById,
  updateMyReview,
  getTechnicianReviews,
  getAllReviews,
  getReviewDetailsById
};