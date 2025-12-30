import Joi from "joi";
import { fileValidator } from "../files";
import { localizedStringValidator } from "../common";

export class CategoryValidator {
  createValidator = Joi.object({
    name: localizedStringValidator.required(),
    image: fileValidator(10 * 1024 * 1000, [
      "image/png",
      "image/jpeg",
      "image/jpg",
    ]).allow(null),
  }).unknown(false);

  editValidator = Joi.object({
    name: localizedStringValidator,
    image: fileValidator(10 * 1024 * 1000, [
      "image/png",
      "image/jpeg",
      "image/jpg",
    ]).allow(null),
  }).unknown(false);

  getValidator = Joi.object({
    name: Joi.string(),
  }).unknown(false);
}

export class SubCategoryValidator {
  createValidator = Joi.object({
    name: localizedStringValidator.required(),
    image: fileValidator(10 * 1024 * 1000, [
      "image/png",
      "image/jpeg",
      "image/jpg",
    ]).allow(null),
    category: Joi.string().required(),
  }).unknown(false);

  editValidator = Joi.object({
    name: localizedStringValidator,
    image: fileValidator(10 * 1024 * 1000, [
      "image/png",
      "image/jpeg",
      "image/jpg",
    ]).allow(null),
  }).unknown(false);

  getValidator = Joi.object({
    name: Joi.string(),
    category: Joi.string(),
  }).unknown(false);
}
