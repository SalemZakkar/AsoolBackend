import { Request, Response } from "express";
import { UserService } from "../user/service";
import {
  comparePassword,
  decodeToken,
  hashPassword,
  sendSuccessResponse,
  signToken,
} from "../../core";
import {
  AuthInvalidCredentialsError,
  AuthPasswordMismatchError,
  AuthRefreshTokenExpiredError,
  AuthRefreshTokenWrongError,
} from "./errors";
import { AuthSignUpInput } from "./interface";
import { firebaseApp } from "../firebase";
import { UserRole } from "../models";

export class AuthController {
  private userService = new UserService();
  signIn = async (req: Request, res: Response) => {
    let { email, password } = req.body;
    let user = await this.userService.getUser({ email: email });
    if (!user || !(await comparePassword(user?.password || "", password))) {
      throw new AuthInvalidCredentialsError();
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
  signUp = async (req: Request, res: Response) => {
    let input: AuthSignUpInput = req.body;
    if (input.confirmPassword != input.password) {
      throw new AuthPasswordMismatchError();
    }
    input.password = await hashPassword(input.password, 10);
    let user = await this.userService.createAccount({
      email: input.email,
      name: input.name,
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
    sendSuccessResponse({
      res: res,
      accessToken: token,
      refreshToken: refreshToken,
      data: user,
    });
  };
  refreshToken = async (req: Request, res: Response) => {
    let { refreshToken } = req.body;
    let result = decodeToken(refreshToken, process.env.JWTREFRESH!);
    if (result.isExpired) {
      throw new AuthRefreshTokenExpiredError();
    }
    if (result.isWrong) {
      throw new AuthRefreshTokenWrongError();
    }
    let userId = result.data.userId;

    let token = signToken({ params: { userId: userId }, expires: "1d" });
    let refresh = signToken({
      params: { userId: userId },
      key: process.env.JWTREFRESH!,
      expires: "30d",
    });
    let user = await this.userService.getUser({_id: userId});
    sendSuccessResponse({
      res: res,
      accessToken: token,
      refreshToken: refresh,
      data: user,
    });
  };

  signInFirebase = async (req: Request, res: Response) => {
    let { token } = req.body;
    let decoded = await firebaseApp().auth().verifyIdToken(token);

    let user = await this.userService.getUser({firebaseId: decoded.uid});
    if (!user) {
      let googleAccount = await firebaseApp().auth().getUser(decoded.uid);
      let email = googleAccount.email;
      user = await this.userService.createAccount({
        email: email!,
        firebaseId: decoded.uid,
        name: googleAccount.displayName || "User",
        role: UserRole.user,
      });
    }
    let accessToken = signToken({
      params: { userId: user._id },
      expires: "1d",
    });
    let refreshToken = signToken({
      params: { userId: user._id },
      key: process.env.JWTREFRESH!,
      expires: "30d",
    });
    sendSuccessResponse({
      res: res,
      accessToken: accessToken,
      refreshToken: refreshToken,
      data: user,
    });
  };
}
