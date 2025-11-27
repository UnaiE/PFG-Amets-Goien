import Joi from "joi";

export const empleadoSchema = Joi.object({
  nombre: Joi.string().trim().min(1).max(100).required(),
  apellidos: Joi.string().trim().min(1).max(100).required(),
  edad: Joi.number().integer().min(0).optional().allow(null),
  dni: Joi.string().trim().max(20).optional().allow('', null),
  email: Joi.string().trim().email().max(255).optional().allow('', null),
  telefono: Joi.string().trim().pattern(/^[0-9+\-\s()]{7,20}$/).optional().allow('', null),
  direccion: Joi.string().trim().optional().allow('', null),
  cargo: Joi.string().trim().max(100).optional().allow('', null)
}).unknown(false);