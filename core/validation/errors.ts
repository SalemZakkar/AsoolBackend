import { AppErrorCodes, buildError } from "../errors";

export enum ValidationError {
  WrongInput = "01",
}

buildError(AppErrorCodes.validations, [
  {
    code: ValidationError.WrongInput,
    message: "Request Validation Error.",
    statusCode: 400,
  },
]);


