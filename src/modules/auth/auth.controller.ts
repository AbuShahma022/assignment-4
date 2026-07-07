import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authService } from "./auth.service";
import httpStatus from "http-status";

const register = catchAsync(async(req,res)=>{

    const payload = req.body

    const result = await authService.register(payload)

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User registered successfully.",
      data: result,
    });

})

const login = catchAsync(async(req,res)=>{

    const payload = req.body;

  const {accessToken, refreshToken} = await authService.login(payload);

  res.cookie("accessToken",accessToken, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully.",
    data: {
            accessToken,
            refreshToken
        }
  });
    


})

const refreshToken = catchAsync(async(req,res)=>{
    const refreshToken = req.cookies.refreshToken;

    const  {accessToken} = await authService.refreshToken(refreshToken);
      res.cookie("accessToken", accessToken, {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 days
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully.",
        data: accessToken
    });
})


export const authController = {
    register,
    login,
    refreshToken
}