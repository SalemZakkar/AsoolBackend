import { NextFunction, Request, Response } from "express";

export const localizedFieldsMiddleware =
  (...fields: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    for (let i = 0; i < fields.length; i++) {
      if (typeof req.body[fields[i]!] === "string") {
        req.body[fields[i]!] = getLocalizedData(req.body[fields[i]!]);
      }
    }
    next();
  };

export const localizationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers["accept-language"];
  req.language = header?.startsWith("ar") ? "ar" : "en";
  next();
};

let getLocalizedData = (data: any) => {
  if (typeof data === "object") {
    return { ar: data["ar"], en: data["en"] };
  }
  if (typeof data === "string") {
    return { en: data };
  }
  return undefined;
};
