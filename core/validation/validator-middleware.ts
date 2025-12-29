import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { ValidationWrongInputError} from "./errors";
export function validateJsonBody(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      req.body = {};
    }
    if(!req.files){
        req.files = {};
    }
    let data = {...req.body,...req.files};
    let { error } = schema.validate(data, { abortEarly: false , noDefaults: false , });
    if (error) {
      throw new ValidationWrongInputError(error.details)
    } else {
      next();
    }
  };
}

export function validateJsonQuery(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    let { error } = schema.validate(req.query);
    if (error) {
        throw new ValidationWrongInputError(error.details)
    } else {
      next();
    }
  };
}
