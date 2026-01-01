import { Router } from "express";
import { UserController } from "./controller";
import { multerFiles, validateJsonBody, validateJsonQuery } from "../../core";
import {
  userChangePasswordValidator,
  userCreateValidator,
  userGetValidator,
  userOtpSendValidator,
  userResetPasswordValidator,
  userUpdateMineValidator,
  userUpdateValidator,
  userVerifyEmail,
} from "./validator";
import { firebaseTokenValidator } from "../common";
import { permissionMiddleWare } from "../common";
import { protection } from "../common";
import { UserAction } from "./abilities";

let userRouter = Router();

let userController = new UserController();

userRouter.get("/mine", protection, userController.getMine);

userRouter.patch(
  "/mine",
  protection,
  multerFiles("avatar"),
  validateJsonBody(userUpdateMineValidator),
  userController.updateMine
);

userRouter.post(
  "/mine/verifyEmail",
  protection,
  validateJsonBody(userVerifyEmail),
  userController.verifyEmail
);

userRouter.post(
  "/mine/forgotPassword",
  validateJsonBody(userOtpSendValidator),
  userController.forgetPassword
);

userRouter.post(
  "/mine/resetPassword",
  validateJsonBody(userResetPasswordValidator),
  userController.resetPassword
);

userRouter.post(
  "/mine/changePassword",
  protection,
  validateJsonBody(userChangePasswordValidator),
  userController.changePassword
);

userRouter.patch(
  "/mine/googleAccount",
  protection,
  validateJsonBody(firebaseTokenValidator),
  userController.setGoogleAccount
);

userRouter.delete(
  "/mine/googleAccount",
  protection,
  userController.unlinkGoogleAccount
);

userRouter.post(
  "/mine/sendEmailOtp",
  protection,
  userController.sendEmailVerifyOtp
);

userRouter.get(
  "/",
  protection,
  permissionMiddleWare(UserAction.manage, "user"),
  validateJsonQuery(userGetValidator),
  userController.getByCriteria
);

userRouter.post(
  "/",
  protection,
  permissionMiddleWare(UserAction.manage, "user"),
  multerFiles("avatar"),
  validateJsonBody(userCreateValidator),
  userController.create
);

userRouter.patch(
  "/:id",
  protection,
  permissionMiddleWare(UserAction.manage, "user"),
  multerFiles("avatar"),
  validateJsonBody(userUpdateValidator),
  userController.updateUser
);

userRouter.get("/:id", protection, userController.getUserById);

export { userRouter };
