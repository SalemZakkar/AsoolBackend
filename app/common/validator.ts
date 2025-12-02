import Joi from "joi";

export const firebaseTokenValidator = Joi.object({
    token: Joi.string().required(),
})