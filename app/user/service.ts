import mongoose, { ClientSession, ObjectId } from "mongoose";
import { IUser, UserUpdateFields } from "./interface";
import { UserModel } from "../models/user-model";
import { MongooseQuery } from "../../core/db/mongoose-queries-util";
import { OtpService } from "../otp/service";
import { OtpReason } from "../otp/interface";
import { hashPassword } from "../../core";

export class UserService {
  private otpService = new OtpService();
  createAccount = async (data: IUser) => {
    let res = await UserModel.create(data);
    return res;
  };

  update = async (
    id: string | mongoose.ObjectId,
    data: UserUpdateFields,
    session?: ClientSession
  ) => {
    let res = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
      session: session ? session : null,
    });
    return res;
  };

  updateAvatar = async (
    id: string | mongoose.ObjectId,
    avatar: string,
    session: ClientSession
  ) => {
    let res = await UserModel.findByIdAndUpdate(
      id,
      { avatar: avatar },
      { session: session, new: true }
    );
    return res;
  };

  deletePhoto = async (
    id: string | mongoose.ObjectId,
    session: ClientSession
  ) => {
    let res = await UserModel.findByIdAndUpdate(
      id,
      { avatar: null },
      { session: session, new: true }
    );
    return res;
  };

  setPassword = async (
    id: mongoose.ObjectId | String,
    password: string,
    session?: ClientSession
  ) => {
    let res = await UserModel.findByIdAndUpdate(
      id,
      { password: await hashPassword(password, 10) },
      { session: session ? session : null }
    );
    return res;
  };

  setGoogleId = async (id: string | mongoose.ObjectId, googleId: String) => {
    let res = await UserModel.findByIdAndUpdate(
      id,
      { firebaseId: googleId },
      { new: true }
    );
    return res;
  };

  getUserByEmail = async (email: string) => {
    return UserModel.findOne({ email: email });
  };

  getUserById = async (id: string | mongoose.ObjectId) => {
    return await UserModel.findById(id);
  };

  getUserByCriteria = async (query: MongooseQuery) => {
    return UserModel.findAndCount(query);
  };

  verifyUserOtp = async (
    id: string | mongoose.ObjectId,
    userId: string | mongoose.ObjectId,
    otp: string
  ) => {
    await this.otpService.getOtp({
      id: id,
      otp: otp,
      userId: userId,
      reason: OtpReason.VerifyEmail,
    });
    let session = await mongoose.startSession();
    session.startTransaction();
    try {
      await this.otpService.deleteOtp(id, session);
      await this.update(userId, { isEmailVerified: true }, session);
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    }
  };

  resetUserPassword = async (
    id: string | mongoose.ObjectId,
    userId: string | mongoose.ObjectId,
    otp: string,
    password: string
  ) => {
    await this.otpService.getOtp({
      id: id,
      otp: otp,
      userId: userId,
      reason: OtpReason.ResetPassword,
    });
    let session = await mongoose.startSession();
    session.startTransaction();
    try {
      await this.otpService.deleteOtp(id, session);
      await this.setPassword(userId, password, session);
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    }
  };
}
