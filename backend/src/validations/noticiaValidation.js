import Joi from "joi";

export const noticiaSchema = Joi.object({
  titulo: Joi.string().trim().min(3).max(255).required(),
  contenido: Joi.string().trim().optional().allow('', null),
  url_imagen: Joi.string().trim().max(500).optional().allow('', null),
  creado_por: Joi.number().integer().optional()
}).unknown(false);