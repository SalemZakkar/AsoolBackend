import { Router } from "express";
import { protection } from "../auth/middleware";
import { UserController } from "./controller";
import { validateJsonBody, validateJsonQuery } from "../../core";
import {
  userChangePasswordValidator,
  userGetValidator,
  userOtpSendValidator,
  userResetPasswordValidator,
  userUpdateMineValidator,
  userUpdateValidator,
  userVerifyEmail,
} from "./validator";

let userRouter = Router();

let userController = new UserController();

userRouter.get("/mine", protection, userController.getMine);

userRouter.patch(
  "/updateMine",
  protection,
  validateJsonBody(userUpdateMineValidator),
  userController.updateMine
);

userRouter.patch(
  "/:id",
  protection,
  validateJsonBody(userUpdateValidator),
  userController.updateUser
);
userRouter.get(
  "/",
  protection,
  validateJsonQuery(userGetValidator),
  userController.getByCriteria
);

userRouter.post("/sendEmailOtp", protection, userController.sendEmailVerifyOtp);

userRouter.post(
  "/verifyEmail",
  protection,
  validateJsonBody(userVerifyEmail),
  userController.verifyEmail
);

userRouter.post(
  "/forgetPassword",
  validateJsonBody(userOtpSendValidator),
  userController.forgetPassword
);

userRouter.post(
  "/resetPassword",
  validateJsonBody(userResetPasswordValidator),
  userController.resetPassword
);

userRouter.post(
  "/changePassword",
  protection,
  validateJsonBody(userChangePasswordValidator),
  userController.changePassword
);
export { userRouter };
