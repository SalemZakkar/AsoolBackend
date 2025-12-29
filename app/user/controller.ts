import { Request, Response } from "express";
import { UserService } from "./service";
import {
  executeWithTransaction,
  getFilesByFieldName,
  getQueries,
  sendSuccessResponse,
} from "../../core";
import { UserUpdateFields } from "../models/user/interface";
import { OtpService } from "../otp/service";
import { OtpReason } from "../models/otp/interface";
import { UserAlreadyVerifiedError, UserNotFoundError } from "./errors";
import { firebaseApp } from "../firebase";
import { FileService } from "../files";

export class UserController {
  private service = new UserService();
  private otpService = new OtpService();
  private fileService = new FileService();
  getMine = async (req: Request, res: Response) => {
    let userId = (req as any).userId;
    let user = await this.service.getUserById(userId);
    sendSuccessResponse({ res: res, data: user });
  };
  sendEmailVerifyOtp = async (req: Request, res: Response) => {
    let user = await this.service.getUserById((req as any).userId);
    if (user?.isEmailVerified == true) {
      throw new UserAlreadyVerifiedError();
    }
    let otp = await this.otpService.createOtp({
      user: (req as any).userId,
      reason: OtpReason.VerifyEmail,
    });
    sendSuccessResponse({
      res: res,
      sent: otp.sent,
      nextDate: otp.otp!.nextTime(),
      vid: otp.sent ? otp.otp._id : undefined,
    });
  };
  verifyEmail = async (req: Request, res: Response) => {
    let { vid, otp } = req.body;
    let userId = (req as any).userId;
    await executeWithTransaction(async (session) => {
      await this.otpService.getOtp({
        id: vid,
        otp: otp,
        reason: OtpReason.VerifyEmail,
      });
      let user = await this.service.update(
        userId,
        { isEmailVerified: true },
        session
      );
      await this.otpService.deleteOtp(vid, session);
      sendSuccessResponse({
        res: res,
        data: user,
      });
    });
  };
  forgetPassword = async (req: Request, res: Response) => {
    let { email } = req.body;
    let user = await this.service.getUserByEmail(email);
    if (!user) {
      throw new UserNotFoundError();
    }
    let otp = await this.otpService.createOtp({
      user: user._id,
      reason: OtpReason.ResetPassword,
    });
    sendSuccessResponse({
      res: res,
      sent: otp.sent,
      nextDate: otp.otp!.nextTime(),
      vid: otp.sent ? otp.otp._id : undefined,
    });
  };
  resetPassword = async (req: Request, res: Response) => {
    let { vid, otp, password } = req.body;
    let otpResult = await this.otpService.getOtp({
      id: vid,
      otp: otp,
      reason: OtpReason.ResetPassword,
    });
    await executeWithTransaction(async (session) => {
      await this.service.setPassword(otpResult.user, password, session);
      await this.otpService.deleteOtp(otpResult.id, session);
      sendSuccessResponse({
        res: res,
      });
    });
  };
  changePassword = async (req: Request, res: Response) => {
    let { password } = req.body;
    let userId = (req as any).userId;
    await this.service.setPassword(userId, password);
    sendSuccessResponse({
      res: res,
    });
  };
  changeUserEmail = async (req: Request, res: Response) => {
    await executeWithTransaction(async (session) => {
      let { email } = req.body;
      let userId = (req as any).userId;
      let user = await this.service.changeUserEmail(userId, email, session);
      await this.otpService.deleteUserOtp(
        userId,
        OtpReason.VerifyEmail,
        session
      );
      sendSuccessResponse({ res: res, data: user });
    });
  };
  updateUser = async (req: Request, res: Response) => {
    let fields: UserUpdateFields = req.body;
    let user = await this.service.getUserById(req.params!.id!);
    if (!user) {
      throw new UserNotFoundError();
    }
    let result = await executeWithTransaction(async (session) => {
      await this.fileService.deleteFile(user?.avatar);
      let file = await this.fileService.saveFile(
        getFilesByFieldName(req, "avatar").at(0),
        session
      );
      return await this.service.update(
        req.params!.id!,
        {
          ...fields,
          avatar: fields.avatar === null ? null : file?.id,
        },
        session
      );
    });
    sendSuccessResponse({ res: res, data: result });
  };
  updateMine = async (req: Request, res: Response) => {
    let { name, phone, avatar } = req.body;
    let result = await executeWithTransaction(async (session) => {
      let old = await this.service.getUserById(req.userId!);
      await this.fileService.deleteFile(old?.avatar);
      let file = await this.fileService.saveFile(
        getFilesByFieldName(req, "avatar").at(0)
      );
      return await this.service.update(
        req.userId!,
        {
          avatar: avatar === null ? null : file?.id,
          name: name,
          phone: phone,
        },
        session
      );
    });
    sendSuccessResponse({ res: res, data: result });
  };
  getByCriteria = async (req: Request, res: Response) => {
    let query = getQueries(req.query);
    let result = await this.service.getUserByCriteria(query);
    sendSuccessResponse({ res: res, ...result });
  };
  getUserById = async (req: Request, res: Response) => {
    let user = await this.service.getUserById(req.params!.id!);
    if (!user) {
      throw new UserNotFoundError();
    }
    sendSuccessResponse({ res: res, data: user });
  };

  setGoogleAccount = async (req: Request, res: Response) => {
    let { token } = req.body;
    let decoded = await firebaseApp().auth().verifyIdToken(token);
    let userId = (req as any).userId;
    let user = await this.service.update(userId, { firebaseId: decoded.uid });
    sendSuccessResponse({ res: res, data: user });
  };
  unlinkGoogleAccount = async (req: Request, res: Response) => {
    let userId = (req as any).userId;
    let user = await this.service.update(userId, { firebaseId: null });
    sendSuccessResponse({ res: res, data: user });
  };
}
