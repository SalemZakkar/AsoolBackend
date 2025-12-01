import Joi from "joi";
import { UserUpdateFields } from "./interface";
import { paginationJoiObject, stringQueryValidator } from "../../core";

export const userUpdateValidator = Joi.object<UserUpdateFields>({
  name: Joi.string(),
  phone: Joi.alternatives(
    Joi.object({
      code: Joi.string(),
      phone: Joi.string(),
    }).and("code", "phone"),
    Joi.valid(null)
  ),
  email: Joi.string().email(),
  isEmailVerified: Joi.boolean(),
}).unknown(false);

export const userGetValidator = Joi.object({
  name: stringQueryValidator,
  email: stringQueryValidator,
  ...paginationJoiObject,
}).unknown(false);

export const userUpdateMineValidator = Joi.object({
  name: Joi.string(),
  phone: Joi.alternatives(
    Joi.object({
      code: Joi.string(),
      phone: Joi.string(),
    }).and("code", "phone"),
    Joi.valid(null)
  ),
}).unknown(false);

export const userOtpSendValidator = Joi.object({
  email: Joi.string().email().required(),
}).unknown(false);

export const userVerifyEmail = Joi.object({
  vid: Joi.string().required(),
  otp: Joi.string().required(),
}).unknown(false);

export const userResetPasswordValidator = Joi.object({
  vid: Joi.string().required(),
  otp: Joi.string().required(),
  password: Joi.string().required().min(8).max(32),
  email: Joi.string().email().required(),
  confirmPassword: Joi.string()
    .required()
    .min(8)
    .max(32)
    .valid(Joi.ref("password")),
}).unknown(false);

export const userChangePasswordValidator = Joi.object({
  password: Joi.string().required().min(8).max(32),
  confirmPassword: Joi.string()
    .required()
    .min(8)
    .max(32)
    .valid(Joi.ref("password")),
}).unknown(false);
