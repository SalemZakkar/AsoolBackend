import Joi from "joi";

export function fileValidator(size: number, type: string[]) {
    return Joi.array().items(Joi.object({
        mimetype: Joi.string().valid(...type).required(),
        size: Joi.number().max(size).required()
    }).unknown(true)).single();
}