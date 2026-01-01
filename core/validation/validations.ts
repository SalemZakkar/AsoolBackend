import Joi from "joi";

export const phoneValidator = (input: {
  allowNull?: boolean | undefined;
  required?: boolean | undefined;
} = {}) => {
  let schema: any = Joi.object({
    code: Joi.string(),
    phone: Joi.string(),
  }).and("code", "phone");

  if (input.required) {
    schema = schema.required();
  } else if (input.allowNull) {
    schema = Joi.alternatives().try(schema, Joi.valid(null));
  }

  return schema;
};

// export const AddressValidator = (input: {
//     address?: boolean,
//     position?: boolean,
//     allowPositionNull? :boolean,
//     allowAddressNull?: boolean,
// } = {}) => {
// let address = Joi.object()
// }