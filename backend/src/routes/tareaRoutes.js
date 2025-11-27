import express from 'express';
import { getAllTareas, getTareaById, createTarea, updateTarea, deleteTarea } from '../controllers/tareaController.js';
import { validate } from '../middleware/validate.js';
import { tareaSchema } from '../validations/tareaValidation.js';

const router = express.Router();

// Tarea routes
router.get('/', getAllTareas);
router.get('/:id', getTareaById);
router.post('/', validate(tareaSchema), createTarea);
router.put('/:id', validate(tareaSchema), updateTarea);
router.delete('/:id', deleteTarea);

export default router;