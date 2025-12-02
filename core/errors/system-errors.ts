import { AppErrorCodes } from "./error-codes";
import { Exception} from "./exception";

export enum SystemErrors {
  JsonParseError = "01",
  NotFound = "02"
}

Exception.setErrors(AppErrorCodes.system, [
  {
    code: SystemErrors.JsonParseError,
    message: "Json Parse Error",
    statusCode: 400,
  },
    {
    code: SystemErrors.NotFound,
    message: "Not Found",
    statusCode: 404,
  },
]);
