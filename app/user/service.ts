import mongoose, { ClientSession } from "mongoose";
import { IUser, UserUpdateFields } from "../models/user/interface";
import { OtpReason, UserModel } from "../models";
import {
  DBNotFoundError,
  executeWithTransaction,
  MongoId,
  MongooseQuery,
} from "../../core/";
import { hashPassword } from "../../core";
import { OtpService } from "../otp/service";
import { UserAlreadyVerifiedError, UserEmailInUserError, UserNotFoundError } from "./errors";
import { FileService } from "../files";
import { firebaseApp } from "../firebase";

export class UserService {
  otpService = new OtpService();
  fileService = new FileService();

  createAccount = async (data: IUser) => {
    return UserModel.create(data);
  };

  create = async (data: any) => {
    let { ...values } = data;
    if (values.password) {
      values.password = await hashPassword(values.password!, 10);
    }
    values.avatar = await this.fileService.saveFile(values.avatar);
    values.isEmailVerified = true;
    return await UserModel.create(values);
  };

  update = async (
    id: string | mongoose.ObjectId,
    data: UserUpdateFields,
    session: ClientSession | null = null
  ) => {
    let { ...values } = data;
    if (values.password) {
      values.password = await hashPassword(values.password!, 10);
    }
    let old = await UserModel.findByIdIfExists(id);
    values.avatar = await this.fileService.processSingleFileSwitch(
      values.avatar,
      old.avatar
    );
    return UserModel.findByIdAndUpdate(id, values, {
      new: true,
      session: session,
    });
  };
  getUserByCriteria = async (query: MongooseQuery) => {
    return UserModel.findAndCount(query);
  };

  getUser = async (params: any) => {
    let res = await UserModel.findOne(params);
    if (!res) {
      throw new UserNotFoundError();
    }
    return res;
  };

  sendEmailVerify = async (id: MongoId) => {
    let user = await this.getUser({ _id: id });
    if (user.isEmailVerified == true) {
      throw new UserAlreadyVerifiedError();
    }
    return this.otpService.createOtp({
      user: user._id,
      reason: OtpReason.VerifyEmail,
    });
  };

  verifyEmail = async (id: MongoId, code: string) => {
    await executeWithTransaction(async (session) => {
      await this.otpService.getOtp({
        id: id,
        otp: code,
        reason: OtpReason.VerifyEmail,
      });
      await this.update(
        id,
        {
          isEmailVerified: true,
        },
        session
      );
      await this.otpService.deleteOtp(id, session);
    });
  };

  forgetPassword = async (email: string) => {
    let user = await this.getUser({ email: email });
    return this.otpService.createOtp({
      user: user._id,
      reason: OtpReason.ResetPassword,
    });
  };

  resetPassword = async (vid: MongoId, code: string, password: string) => {
    let otpResult = await this.otpService.getOtp({
      id: vid,
      otp: code,
      reason: OtpReason.ResetPassword,
    });
    await executeWithTransaction(async (session) => {
      await this.update(
        otpResult.user,
        {
          password: password,
        },
        session
      );
      await this.otpService.deleteOtp(otpResult.id, session);
    });
  };

  setGoogleAccount = async (id: MongoId, token: string | null) => {
    if (token) {
      return this.update(id, { firebaseId: null });
    }
    let decoded = await firebaseApp().auth().verifyIdToken(token!);
    return this.update(id, { firebaseId: decoded.uid });
  };
}
