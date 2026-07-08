import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { technicianProfileService } from "./technicianProfile.service";
import httpStatus  from "http-status";

const createTechnicianProfile = catchAsync(async (req, res) => {
  const result = await technicianProfileService.createTechnicianProfile(
    req.user!.id,
    req.body
  );

  res.cookie("accessToken", result.tokens.accessToken, {
  httpOnly: true,
  secure: config.nodeEnv === "production",
  sameSite: "lax",
});

res.cookie("refreshToken", result.tokens.refreshToken, {
  httpOnly: true,
  secure: config.nodeEnv === "production",
  sameSite: "lax",
});

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Technician profile created successfully.",
    data: result.technicianProfile,
  });
});

const getMyTechnicianProfile = catchAsync(async (req, res) => {
  const result = await technicianProfileService.getMyTechnicianProfile(
    req.user!.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Technician profile retrieved successfully.",
    data: result,
  });
});

const updateMyTechnicianProfile = catchAsync(async (req, res) => {
  const result = await technicianProfileService.updateMyTechnicianProfile(
    req.user!.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Technician profile updated successfully.",
    data: result,
  });
});

const getAllTechnicians = catchAsync(async (req, res) => {
  const result = await technicianProfileService.getAllTechnicians();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Technicians retrieved successfully.",
    data: result,
  });
});

const getSingleTechnician = catchAsync(async (req, res) => {
  const result = await technicianProfileService.getSingleTechnician(
    req.params.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Technician retrieved successfully.",
    data: result,
  });
});

export const technicianProfileController = {
  createTechnicianProfile,
  getMyTechnicianProfile,
  updateMyTechnicianProfile,
  getAllTechnicians,
  getSingleTechnician
  
};