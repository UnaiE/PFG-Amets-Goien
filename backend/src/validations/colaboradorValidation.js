import Joi from "joi";

export const colaboradorSchema = Joi.object({
  nombre: Joi.string().trim().min(1).max(100).required(),
  apellidos: Joi.string().trim().min(1).max(100).required(),
  email: Joi.string().trim().email().max(255).optional().allow('', null),
  telefono: Joi.string().trim().pattern(/^[0-9+\-\s()]{7,20}$/).optional().allow('', null),
  direccion: Joi.string().trim().optional().allow('', null),
  anotacion: Joi.string().trim().optional().allow('', null),
  periodicidad: Joi.string().valid('puntual', 'mensual', 'trimestral', 'semestral', 'anual').optional().default('puntual'),
  stripe_subscription_id: Joi.string().trim().optional().allow('', null)
}).unknown(false);