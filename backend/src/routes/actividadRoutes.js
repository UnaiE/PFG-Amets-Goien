import express from 'express';
import { getActividades, getActividadById, createActividad, updateActividad, deleteActividad } from '../controllers/actividadController.js';
import { validate } from '../middleware/validate.js';
import { actividadSchema } from '../validations/actividadValidation.js';

const router = express.Router();

// Actividad routes
router.get('/', getActividades);
router.get('/:id', getActividadById);
router.post('/', validate(actividadSchema), createActividad);
router.put('/:id', validate(actividadSchema), updateActividad);
router.delete('/:id', deleteActividad);

export default router;