import { Router } from "express";
import { authController } from "./auth.controller";
import validateZodSchema from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.validation";


const router = Router()

router.post("/register",validateZodSchema(AuthValidation.registerValidationSchema),authController.register)
router.post("/login",validateZodSchema(AuthValidation.loginValidationSchema),authController.login)
router.post("/refresh-token",authController.refreshToken)





export const authRoute = router