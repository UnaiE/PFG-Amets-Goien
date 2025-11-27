import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().trim().min(3).max(50).required(),
  password: Joi.string().min(4).max(200).required(),
  role: Joi.string().valid("admin", "empleado").required()
}).unknown(false);

export const loginSchema = Joi.object({
  username: Joi.string().trim().required(),
  password: Joi.string().required()
}).unknown(false);

export const updateUserSchema = Joi.object({
  username: Joi.string().trim().min(3).max(50).optional(),
  password: Joi.string().min(4).max(200).optional(),
  role: Joi.string().valid("admin", "empleado").optional()
}).unknown(false);


