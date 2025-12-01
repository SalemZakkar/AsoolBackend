import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { AppErrorCodes, Exception } from "../errors";
import { ValidationError } from "./errors";
export function validateJsonBody(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      req.body = {};
    }
    let { error } = schema.validate(req.body, { abortEarly: false , noDefaults: false , });
    if (error) {
      throw Exception.get({
        feature: AppErrorCodes.validations,
        code: ValidationError.WrongInput,
        args: error.details,
      });
    } else {
      next();
    }
  };
}

export function validateJsonQuery(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    let { error } = schema.validate(req.query);
    if (error) {
      throw Exception.get({
        feature: AppErrorCodes.validations,
        code: ValidationError.WrongInput,
        args: error.details,
      });
    } else {
      next();
    }
  };
}
