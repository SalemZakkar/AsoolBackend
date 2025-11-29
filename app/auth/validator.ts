import Joi from "joi";
import { AuthSignUpInput, AuthSignInInput } from "./interface";

export const authSignUpValidator = Joi.object<AuthSignUpInput>({
  confirmPassword: Joi.string().required(),
  email: Joi.string().required(),
  name: Joi.string().required(),
  password: Joi.string().required(),
  phone: Joi.object({
    code: Joi.string(),
    phone: Joi.string(),
  })
    .and("code", "phone")
    .optional(),
}).unknown(false);

export const authSignInValidator = Joi.object<AuthSignInInput>({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(32).required(),
}).unknown(false);

export const authRefreshValidator = Joi.object({
  refreshToken: Joi.string().required(),
}).unknown(false);
