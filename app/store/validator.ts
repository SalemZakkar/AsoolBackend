import Joi from "joi";
import { localizedStringValidator } from "../common";
import { fileValidator } from "../files";
import { paginationJoiObject, phoneValidator } from "../../core";

export class StoreValidator {
  create = Joi.object({
    name: localizedStringValidator.required(),
    image: fileValidator(10 * 1024 * 1000, [
      "image/png",
      "image/jpeg",
      "image/jpg",
    ]).allow(null),
    categories: Joi.array().items(Joi.string().required()).min(1).required(),
    phone: phoneValidator({ required: true }),
    address: Joi.object({
      address: localizedStringValidator,
      position: Joi.alternatives(
        Joi.object({
          lat: Joi.number().required(),
          lng: Joi.number().required(),
        }).required()
      ).required(),
    }).required(),
    owner: Joi.string().required(),
  }).unknown(false);

  edit = Joi.object({
    name: localizedStringValidator,
    image: fileValidator(10 * 1024 * 1000, [
      "image/png",
      "image/jpeg",
      "image/jpg",
    ]).allow(null),
    categories: Joi.array().items(Joi.string().required()).min(1),
    phone: phoneValidator(),

    address: Joi.object({
      address: localizedStringValidator,
      position: Joi.alternatives(
        Joi.object({
          lat: Joi.number(),
          lng: Joi.number(),
        }).and("lat", "lng")
      ),
    }),
  });

  get = Joi.object({
    ...paginationJoiObject,
    name: Joi.string(),
    id: Joi.string(),
    owner: Joi.string(),
    categories: Joi.array().items(Joi.string().required()).min(1),
  });
}
