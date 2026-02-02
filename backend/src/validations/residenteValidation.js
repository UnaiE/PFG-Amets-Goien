import Joi from "joi";

export const residenteSchema = Joi.object({
  nombre: Joi.string().trim().min(1).max(100).required(),
  apellidos: Joi.string().trim().min(1).max(100).required(),
  nacionalidad: Joi.string().trim().max(100).optional().allow('', null),
  fecha_nacimiento: Joi.date().optional().allow(null),
  edad: Joi.number().integer().min(0).optional().allow(null),
  fecha_entrada: Joi.date().optional().allow(null),
  fecha_salida: Joi.date().optional().allow(null),
  sexo: Joi.string().trim().max(20).optional().allow('', null),
  situacion: Joi.string().trim().max(100).optional().allow('', null),
  anotacion: Joi.string().trim().optional().allow('', null),
  direccion: Joi.string().trim().optional().allow('', null),
  enlaces_documentos: Joi.string().trim().optional().allow('', null)
}).unknown(false);