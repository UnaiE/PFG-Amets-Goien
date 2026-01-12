import express from 'express';
import { getActividades, getActividadById, createActividad, updateActividad, deleteActividad } from '../controllers/actividadController.js';
import { validate } from '../middleware/validate.js';
import { actividadSchema } from '../validations/actividadValidation.js';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// Rutas públicas para la web principal
router.get('/', getActividades);
router.get('/:id', getActividadById);

// Rutas protegidas para el panel de administración
router.post('/', auth, checkRole('admin', 'empleado', 'user'), validate(actividadSchema), createActividad);
router.put('/:id', auth, checkRole('admin', 'empleado', 'user'), validate(actividadSchema), updateActividad);
router.delete('/:id', auth, checkRole('admin'), deleteActividad);

export default router;