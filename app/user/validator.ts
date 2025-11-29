import Joi from "joi";
import { UserUpdateFields } from "./interface";

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
