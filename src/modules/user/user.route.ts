import { Router } from "express";
import validateZodSchema from "../../middleware/validateRequest";
import { userController } from "./user.controller";
import { UserValidation } from "./user.validation";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post("/register",validateZodSchema(UserValidation.registerValidationSchema),userController.register)
router.get("/me",auth(Role.CUSTOMER,Role.TECHNICIAN,Role.ADMIN),userController.getMyProfile)
router.patch("/me",auth(Role.CUSTOMER,Role.TECHNICIAN,Role.ADMIN),validateZodSchema(UserValidation.updateProfileValidationSchema),userController.updateMyprofile)
router.get("/getalluser",auth(Role.ADMIN),userController.getAllUser)
router.get("/:id",auth(Role.ADMIN),userController.getSingleUser)
router.patch(
  "/:id/status",
  auth(Role.ADMIN),
  validateZodSchema(UserValidation.updateUserStatusValidationSchema),
  userController.updateUserStatus
);




export const userRoute = router