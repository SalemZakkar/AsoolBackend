import {Router} from "express";
import {protection} from "../auth/middleware";
import {UserController} from "./controller";
import {validateJsonBody, validateJsonQuery} from "../../core";
import {
    userChangePasswordValidator,
    userGetValidator,
    userOtpSendValidator,
    userResetPasswordValidator,
    userUpdateMineValidator,
    userUpdateValidator,
    userVerifyEmail,
} from "./validator";
import {files} from "../../core";
import {firebaseTokenValidator} from "../common";

let userRouter = Router();

let userController = new UserController();

userRouter.get("/mine", protection,
    userController.getMine,
);

userRouter.patch(
    "/mine",
    protection,
    files("avatar"),
    validateJsonBody(userUpdateMineValidator),
    userController.updateMine
);

userRouter.patch(
    "/mine/changeEmail",
    protection,
    validateJsonBody(userOtpSendValidator),
    userController.changeUserEmail
);

userRouter.delete(
    "/mine/avatar",
    protection,
    userController.deleteMinePhoto
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

userRouter.patch("/mine/googleAccount", protection,
    validateJsonBody(firebaseTokenValidator),
    userController.setGoogleAccount,
);

userRouter.delete(
    "/mine/googleAccount",
    protection,
    userController.unlinkGoogleAccount
);

userRouter.post("/mine/sendEmailOtp", protection,
    userController.sendEmailVerifyOtp,
);


userRouter.get(
    "/",
    protection,
    validateJsonQuery(userGetValidator),
    userController.getByCriteria
);

userRouter.patch(
    "/:id",
    protection,
    files("avatar"),
    validateJsonBody(userUpdateValidator),
    userController.updateUser
);

userRouter.get(
    "/:id",
    protection,
    userController.getUserById,
);

userRouter.delete(
    "/avatar/:id",
    protection,
    userController.deleteUserPhoto,
);


export {userRouter};
