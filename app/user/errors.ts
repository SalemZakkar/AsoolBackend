import { AppErrorCodes, buildError } from "../../core";

export enum UserErrors {
  UserAlreadyVerified = "01",
  UserNotFound = "02",
}

buildError(AppErrorCodes.user, [
  {
    code: UserErrors.UserAlreadyVerified,
    message: "User Already Verified",
    statusCode: 400,
  },
  {
    code: UserErrors.UserNotFound,
    message: "User Not Found",
    statusCode: 404,
  },
]);
