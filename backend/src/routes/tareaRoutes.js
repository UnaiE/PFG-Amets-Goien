import express from 'express';
import { getAllTareas, getTareaById, createTarea, updateTarea, deleteTarea } from '../controllers/tareaController.js';
import { validate } from '../middleware/validate.js';
import { tareaSchema } from '../validations/tareaValidation.js';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// Tarea routes - todas requieren autenticación
router.get('/', auth, getAllTareas);
router.get('/:id', auth, getTareaById);
router.post('/', auth, checkRole('admin', 'empleado', 'user'), validate(tareaSchema), createTarea);
router.put('/:id', auth, checkRole('admin', 'empleado', 'user'), validate(tareaSchema), updateTarea);
router.delete('/:id', auth, checkRole('admin'), deleteTarea);

export default router;