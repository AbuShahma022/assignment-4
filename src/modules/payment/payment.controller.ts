import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { paymentService } from "./payment.service";
import httpStatus  from "http-status";

const createCheckoutSession = catchAsync(async (req, res) => {
  const result = await paymentService.createCheckoutSession(
    req.user!.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Checkout session created successfully.",
    data: result,
  });
});

const stripeWebhook = catchAsync(async (req, res) => {
  await paymentService.stripeWebhook(req);

  res.status(200).json({
    received: true,
  });
});

const getMyPayments = catchAsync(async (req, res) => {
  const result = await paymentService.getMyPayments(
    req.user!.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payments retrieved successfully.",
    data: result,
  });
});

export const paymentController = {
  createCheckoutSession,
  stripeWebhook,
  getMyPayments
};