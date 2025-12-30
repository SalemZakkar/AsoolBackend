import { Request, Response } from "express";
import { UserService } from "./service";
import {
  getFilesByFieldName,
  getQueries,
  sendSuccessResponse,
} from "../../core";
import { UserUpdateFields } from "../models/user/interface";

export class UserController {
  private service = new UserService();

  getMine = async (req: Request, res: Response) => {
    let user = await this.service.getUser({ _id: req.userId });
    sendSuccessResponse({ res: res, data: user });
  };

  sendEmailVerifyOtp = async (req: Request, res: Response) => {
    let otp = await this.service.sendEmailVerify(req.userId!);
    sendSuccessResponse({
      res: res,
      sent: otp.sent,
      nextDate: otp.otp!.nextTime(),
      vid: otp.sent ? otp.otp._id : undefined,
    });
  };

  verifyEmail = async (req: Request, res: Response) => {
    let { vid, otp } = req.body;
    let user = await this.service.verifyEmail(vid, otp);
    sendSuccessResponse({
      res: res,
      data: user,
    });
  };

  forgetPassword = async (req: Request, res: Response) => {
    let { email } = req.body;
    let otp = await this.service.forgetPassword(email);
    sendSuccessResponse({
      res: res,
      sent: otp.sent,
      nextDate: otp.otp!.nextTime(),
      vid: otp.sent ? otp.otp._id : undefined,
    });
  };

  resetPassword = async (req: Request, res: Response) => {
    let { vid, otp, password } = req.body;
    await this.service.resetPassword(vid, otp, password);
    sendSuccessResponse({ res: res });
  };

  changePassword = async (req: Request, res: Response) => {
    let { password } = req.body;
    await this.service.update(req.userId!, { password: password });
    sendSuccessResponse({
      res: res,
    });
  };

  updateUser = async (req: Request, res: Response) => {
    let fields: UserUpdateFields = req.body;
    let result = await this.service.update(req.params.id!, {
      ...fields,
      avatar: getFilesByFieldName(req, "avatar").at(0) || req.body.avatar,
    });
    sendSuccessResponse({ res: res, data: result });
  };
  updateMine = async (req: Request, res: Response) => {
    let { name, phone, avatar } = req.body;
    let result = await this.service.update(req.userId!, {
      ...{ name: name, phone: phone },
      avatar: getFilesByFieldName(req, "avatar").at(0) || avatar,
    });
    sendSuccessResponse({ res: res, data: result });
  };
  getByCriteria = async (req: Request, res: Response) => {
    let query = getQueries(req.query);
    let result = await this.service.getUserByCriteria(query);
    sendSuccessResponse({ res: res, ...result });
  };
  getUserById = async (req: Request, res: Response) => {
    let user = await this.service.getUser({ _id: req.params!.id! });
    sendSuccessResponse({ res: res, data: user });
  };

  setGoogleAccount = async (req: Request, res: Response) => {
    let { token } = req.body;
    let user = await this.service.setGoogleAccount(req.userId!, token);
    sendSuccessResponse({ res: res, data: user });
  };
  unlinkGoogleAccount = async (req: Request, res: Response) => {
    let user = await this.service.setGoogleAccount(req.userId!, null);
    sendSuccessResponse({ res: res, data: user });
  };
}
