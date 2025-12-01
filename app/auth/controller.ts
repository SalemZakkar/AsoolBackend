import { NextFunction, Request, response, Response } from "express";
import { UserRole, UserService } from "../user";
import {
  AppErrorCodes,
  comparePassword,
  decodeToken,
  Exception,
  hashPassword,
  sendSuccessResponse,
  signToken,
} from "../../core";
import { AuthErrors } from "./errors";
import { AuthSignUpInput } from "./interface";

export class AuthController {
  private userService = new UserService();
  signIn = async (req: Request, res: Response, next: NextFunction) => {
    let { email, password } = req.body;
    let user = await this.userService.getUserByEmail(email);
    if (!user || !(await comparePassword(user?.password || "", password))) {
      throw Exception.get({
        feature: AppErrorCodes.auth,
        code: AuthErrors.InvalidCredentials,
      });
    }

    let token = signToken({ params: { userId: user._id }, expires: "1d" });
    let refreshToken = signToken({
      params: { userId: user._id },
      key: process.env.JWTREFRESH!,
      expires: "30d",
    });
    sendSuccessResponse({
      res: res,
      accessToken: token,
      refreshToken: refreshToken,
      data: user,
    });
  };

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    let input: AuthSignUpInput = req.body;
    if (input.confirmPassword != input.password) {
      throw Exception.get({
        feature: AppErrorCodes.auth,
        code: AuthErrors.PASSWORDMISSMATCH,
      });
    }
    input.password = await hashPassword(input.password, 10);
    let user = await this.userService.createAccount({
      email: input.email,
      name: input.email,
      role: UserRole.user,
      password: input.password,
      phone: input.phone,
    });
    let token = signToken({ params: { userId: user._id }, expires: "1d" });
    let refreshToken = signToken({
      params: { userId: user._id },
      key: process.env.JWTREFRESH!,
      expires: "30d",
    });
    // await SessionModel.insertOne({
    //   accessToken: token,
    //   refreshToken: refreshToken,
    //   user: user._id,
    // });
    sendSuccessResponse({
      res: res,
      accessToken: token,
      refreshToken: refreshToken,
      data: user,
    });
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    let { refreshToken } = req.body;
    let result = decodeToken(refreshToken, process.env.JWTREFRESH!);
    if (result.isExpired) {
      throw Exception.get({
        feature: AppErrorCodes.auth,
        code: AuthErrors.REFRESHTOKENEXPIRED,
      });
    }
    if (result.isWrong) {
      throw Exception.get({
        feature: AppErrorCodes.auth,
        code: AuthErrors.REFRESHTOKENWRONG,
      });
    }
    let userId = result.data.userId;

    let token = signToken({ params: { userId: userId }, expires: "1d" });
    let refresh = signToken({
      params: { userId: userId },
      key: process.env.JWTREFRESH!,
      expires: "30d",
    });
    let user = await this.userService.getUserById(userId);
    sendSuccessResponse({
      res: res,
      accessToken: token,
      refreshToken: refresh,
      data: user,
    });
  };
}
