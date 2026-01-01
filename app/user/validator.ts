import Joi from "joi";
import {paginationJoiObject, stringQueryValidator} from "../../core";
import {UserRole} from "../models/user/interface";
import { fileValidator } from "../files";

export const userUpdateValidator = Joi.object({
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
    role: Joi.string().valid(...Object.values(UserRole)),
    avatar: fileValidator(10 * 1024 * 1000, ["image/jpeg", "image/png", "image/jpg"]).allow(null),
    password: Joi.string(),
    firebaseId: Joi.string(),
}).unknown(false);

export const userCreateValidator = Joi.object({
    name: Joi.string().required(),
    phone: Joi.alternatives(
        Joi.object({
            code: Joi.string(),
            phone: Joi.string(),
        }).and("code", "phone"),
        Joi.valid(null)
    ),
    email: Joi.string().email().required(),
    role: Joi.string().valid(...Object.values(UserRole)).required(),
    avatar: fileValidator(10 * 1024 * 1000, ["image/jpeg", "image/png", "image/jpg"]).allow(null),
    password: Joi.string().required(),
    firebaseId: Joi.string(),
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
    avatar: fileValidator(10 * 1024 * 1000, ["image/jpeg", "image/png", "image/jpg"]).allow(null),
}).unknown(false);

export const userGetValidator = Joi.object({
    name: stringQueryValidator,
    email: stringQueryValidator,
    ...paginationJoiObject,
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

// export const userAvatarFileValidator = Joi.object({
//     avatar: fileValidator(10 * 1024 * 8, ["image/jpeg", "image/png"])
// })