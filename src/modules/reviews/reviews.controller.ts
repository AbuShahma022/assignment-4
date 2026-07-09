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

export const reviewController = {
  createReview,
};