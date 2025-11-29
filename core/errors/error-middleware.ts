import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { AppErrorCodes, Exception, SystemErrors } from ".";
import { DatabaseErrors } from "../db/errors";
function errorMiddleWare(
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let error: Exception;
  if (err instanceof Exception) {
    error = err;
    res
      .status(error.statusCode)
      .json({ code: error.code, message: error.message, args: error.args });
  } else if ((err as any).type == "entity.parse.failed") {
    error = Exception.get({
      feature: AppErrorCodes.system,
      code: SystemErrors.JsonParseError,
    });
    res
      .status(error.statusCode)
      .json({ code: error.code, message: error.message, args: error.args });
  } else if ((err as any).code == 11000) {
    error = Exception.get({
      code: DatabaseErrors.Duplication,
      feature: AppErrorCodes.database,
      args: (err as any).keyValue,
    });
    res
      .status(error.statusCode)
      .json({ code: error.code, message: error.message, args: error.args });
  } else {
    console.log(err);

    res.status(500).json({ message: "Internal Server Error." });
  }
}

export function getAppErrorsApi(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(200).json({ data: Exception.getErrors() });
}

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  throw Exception.get({
    feature: AppErrorCodes.system,
    code: SystemErrors.NotFound,
  });
}

export { errorMiddleWare };
