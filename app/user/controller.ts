import { Request, Response, NextFunction } from "express";
import { UserService } from "./service";
import {
  AppErrorCodes,
  Exception,
  getQueries,
  sendSuccessResponse,
} from "../../core";
import { UserUpdateFields } from "./interface";
import { OtpService } from "../otp/service";
import { OtpChannel, OtpReason } from "../otp/interface";
import { UserErrors } from "./errors";

export class UserController {
  private service = new UserService();
  private otpService = new OtpService();

  getMine = async (req: Request, res: Response, next: NextFunction) => {
    let userId = (req as any).userId;
    let user = await this.service.getUserById(userId);
    sendSuccessResponse({ res: res, data: user });
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    let fields: UserUpdateFields = req.body;
    let user = await this.service.update(req.params!.id!, fields);
    sendSuccessResponse({ res: res, data: user });
  };

  getByCriteria = async (req: Request, res: Response) => {
    let query = getQueries(req.query);
    let result = await this.service.getUserByCriteria(query);
    sendSuccessResponse({ res: res, ...result });
  };

  sendEmailVerifyOtp = async (req: Request, res: Response) => {
    let user = await this.service.getUserById((req as any).userId);
    if (user?.isEmailVerified == true) {
      throw Exception.get({
        feature: AppErrorCodes.user,
        code: UserErrors.UserAlreadyVerified,
      });
    }
    let otp = await this.otpService.createOtp({
      user: (req as any).userId,
      reason: OtpReason.VerifyEmail,
    });
    sendSuccessResponse({
      res: res,
      sent: otp.sent,
      nextDate: otp.otp!.nextTime(),
      vid: otp.sent == true ? otp.otp._id : undefined,
    });
  };

  verifyEmail = async (req: Request, res: Response) => {
    let { vid, otp } = req.body;
    let userId = (req as any).userId;

    await this.service.verifyUserOtp(vid, userId, otp);
    let user = await this.service.getUserById(userId);
    sendSuccessResponse({
      res: res,
      data: user,
    });
  };

  forgetPassword = async (req: Request, res: Response) => {
    let { email } = req.body;
    let user = await this.service.getUserByEmail(email);
    if (!user) {
      throw Exception.get({
        feature: AppErrorCodes.user,
        code: UserErrors.UserNotFound,
      });
    }
    let otp = await this.otpService.createOtp({
      user: user._id,
      reason: OtpReason.ResetPassword,
    });
    sendSuccessResponse({
      res: res,
      sent: otp.sent,
      nextDate: otp.otp!.nextTime(),
      vid: otp.sent == true ? otp.otp._id : undefined,
    });
  };

  resetPassword = async (req: Request, res: Response) => {
    let { vid, otp, email, password } = req.body;
    let user = await this.service.getUserByEmail(email);
    if (!user) {
      throw Exception.get({
        feature: AppErrorCodes.user,
        code: UserErrors.UserNotFound,
      });
    }
    await this.service.resetUserPassword(vid, user._id, otp, password);
    sendSuccessResponse({
      res: res,
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

  updateMine = async (req: Request, res: Response) => {
    
    let userId = (req as any).userId;
    
    let { name, phone } = req.body;
    let user = await this.service.update(userId, { name: name, phone: phone });
    sendSuccessResponse({ res: res, data: user });
  };
}
