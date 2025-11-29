import { Response } from "express";

export function sendSuccessResponse({
  res,
  data,
  total,
  message = "Success",
  ...rest
}: {
  res: Response;
  data?: any;
  total?: number;
  message?: string;
  [key: string]: any;
}) {
  res.status(200).json({
    message: message,
    total: total,
    ...rest,
    data: data,
  });
}

export function sendError({
  res,
  message,
  code = 500,
  ...rest
}: {
  res: Response;
  message: string;
  code: number;
  [key: string]: any;
}) {
  res.status(code).json({
    message: message,
    ...rest,
  });
}
