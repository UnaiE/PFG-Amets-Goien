import Joi from "joi";

// Schema de validación para el formulario de contacto
export const contactoSchema = Joi.object({
  nombre: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "El nombre es obligatorio",
    "string.min": "El nombre debe tener al menos 2 caracteres",
    "any.required": "El nombre es obligatorio"
  }),
  apellidos: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Los apellidos son obligatorios",
    "string.min": "Los apellidos deben tener al menos 2 caracteres",
    "any.required": "Los apellidos son obligatorios"
  }),
  email: Joi.string().trim().email().required().messages({
    "string.empty": "El email es obligatorio",
    "string.email": "El email debe ser válido",
    "any.required": "El email es obligatorio"
  }),
  mensaje: Joi.string().trim().min(10).max(2000).required().messages({
    "string.empty": "El mensaje es obligatorio",
    "string.min": "El mensaje debe tener al menos 10 caracteres",
    "string.max": "El mensaje no puede superar los 2000 caracteres",
    "any.required": "El mensaje es obligatorio"
  }),
  consentimiento: Joi.boolean().valid(true).required().messages({
    "any.only": "Debes aceptar el consentimiento",
    "any.required": "Debes aceptar el consentimiento"
  })
});
