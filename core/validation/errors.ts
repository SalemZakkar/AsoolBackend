import {AppErrorCodes, Exception} from "../errors";

export enum ValidationError {
  WrongInput = "01",
}

Exception.setErrors(AppErrorCodes.validations, [
  {
    code: ValidationError.WrongInput,
    message: "Request Validation Error.",
    statusCode: 400,
  },
]);


