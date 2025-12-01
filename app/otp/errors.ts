import { AppErrorCodes, buildError } from "../../core";

export enum OtpErrors {
  TooManyAttempts = "01",
  WrongOtp = "02",
  OtpExpired = "05",
}

buildError(AppErrorCodes.otp, [
  {
    code: OtpErrors.TooManyAttempts,
    message: "Too Many Attemps",
    statusCode: 429,
  },
  {
    code: OtpErrors.WrongOtp,
    message: "Otp Code Error",
    statusCode: 400,
  },
  {
    code: OtpErrors.OtpExpired,
    message: "Otp expired",
    statusCode: 400,
  },
]);
