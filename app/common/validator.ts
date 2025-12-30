import Joi from "joi";

export const firebaseTokenValidator = Joi.object({
  token: Joi.string().required(),
});

export const localizedStringValidator = Joi.alternatives()
  .try(
    Joi.string().required(),
    Joi.object({
      ar: Joi.string().allow(null),
      en: Joi.string().required(),
    })
  );
