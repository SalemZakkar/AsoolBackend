import Joi from "joi";
import { fileValidator } from "../files";

export class CategoryValidator {
  createValidator = Joi.object({
    name: Joi.string().required(),
    image: fileValidator(10 * 1024 * 1000, [
      "image/png",
      "image/jpeg",
      "image/jpg",
    ]).allow(null),
  }).unknown(false);

  editValidator = Joi.object({
    name: Joi.string(),
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
    name: Joi.string().required(),
    image: fileValidator(10 * 1024 * 1000, [
      "image/png",
      "image/jpeg",
      "image/jpg",
    ]).allow(null),
    category: Joi.string().required(),
  }).unknown(false);

  editValidator = Joi.object({
    name: Joi.string(),
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
