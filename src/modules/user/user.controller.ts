import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userService } from "./user.service";
import httpStatus from "http-status";

const register = catchAsync(async(req,res)=>{

    const payload = req.body

    const result = await userService.register(payload)

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User registered successfully.",
      data: result,
    });

})

const getMyProfile = catchAsync(async(req,res)=>{

    const userId = req.user?.id

    const result = await userService.getMyProfile(userId as string)

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile fetched successfully.",
      data: result,
    });

})

const updateMyprofile = catchAsync(async(req,res)=>{

    const userId = req.user?.id
    const payload = req.body

    const result = await userService.updateMyProfile(userId as string, payload)

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile fetched successfully.",
      data: result,
    });

})

const getAllUser = catchAsync(async (req, res) => {
  const result = await userService.getAllUser();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully.",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const result = await userService.getSingleUser(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully.",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req, res) => {
  const result = await userService.updateUserStatus(
    req.params.id as string,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status updated successfully.",
    data: result,
  });
});

export const userController = {
    register,
    getMyProfile,
    updateMyprofile,
    getAllUser,
    getSingleUser,
    updateUserStatus
}