import Joi from "joi";

let numericOperators = Joi.object({
  eq: Joi.number(),
  ne: Joi.number(),
  in: Joi.array().items(Joi.number()),
  nin: Joi.array().items(Joi.number()),
  lte: Joi.number(),
  gte: Joi.number(),
  gt: Joi.number(),
  lt: Joi.number(),
});

let stringOperators = Joi.object({
  eq: Joi.string(),
  ne: Joi.string(),
  in: Joi.array().items(Joi.string()),
  nin: Joi.array().items(Joi.string()),
});

export const numberQueryValidator = Joi.alternatives().try(
  numericOperators,
  Joi.number()
);
export const stringQueryValidator = Joi.alternatives().try(
  stringOperators,
  Joi.string()
);
