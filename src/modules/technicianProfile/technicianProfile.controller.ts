import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { technicianProfileService } from "./technicianProfile.service";
import httpStatus  from "http-status";

const createTechnicianProfile = catchAsync(async (req, res) => {
  const result = await technicianProfileService.createTechnicianProfile(
    req.user!.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Technician profile created successfully.",
    data: result,
  });
});

export const technicianProfileController = {
  createTechnicianProfile,
};