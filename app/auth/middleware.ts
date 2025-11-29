import { NextFunction, Request, Response } from "express";
import { AppErrorCodes, decodeToken, Exception } from "../../core";
import { AuthErrors } from "./errors";

export const protection = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    throw Exception.get({
      feature: AppErrorCodes.auth,
      code: AuthErrors.UNAUTH,
    });
  }
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw Exception.get({
      feature: AppErrorCodes.auth,
      code: AuthErrors.UNAUTH,
    });
  }

  const token = parts[1];

  let decoded = decodeToken(token ?? "");

  if (decoded.hasError) {
    throw Exception.get({
      feature: AppErrorCodes.auth,
      code: AuthErrors.UNAUTH,
    });
  }

  (req as any).userId = decoded.data.userId;
  next();
};
