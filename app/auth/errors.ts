import { AppErrorCodes, buildError } from "../../core";

export enum AuthErrors {
  InvalidCredentials = "01",
  PASSWORDMISSMATCH = "02",
  UNAUTH = "03",
  JWTEXPIRED = "04",
  REFRESHTOKENWRONG = "05",
  REFRESHTOKENEXPIRED = "06",
}

buildError(AppErrorCodes.auth, [
  {
    code: AuthErrors.InvalidCredentials,
    message: "Invalid email or password",
    statusCode: 400,
  },
  {
    code: AuthErrors.PASSWORDMISSMATCH,
    message: "passwords are not same.",
    statusCode: 400,
  },
  {
    code: AuthErrors.UNAUTH,
    message: "UnAuthenticated.",
    statusCode: 401,
  },
  {
    code: AuthErrors.JWTEXPIRED,
    message: "Token Expired.",
    statusCode: 419,
  },
  {
    code: AuthErrors.REFRESHTOKENWRONG,
    message: "Wrong RefreshToken.",
    statusCode: 400,
  },
  {
    code: AuthErrors.REFRESHTOKENEXPIRED,
    message: "RefreshToken Expired.",
    statusCode: 419,
  },
]);
