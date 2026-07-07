import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import config from "../config";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong!",
    stack: config.nodeEnv === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;