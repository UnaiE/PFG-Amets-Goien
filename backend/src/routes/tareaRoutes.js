import express from 'express';
import { getAllTareas, getTareaById, createTarea, updateTarea, deleteTarea } from '../controllers/tareaController.js';


const router = express.Router();

// Tarea routes
router.get('/', getAllTareas);
router.get('/:id', getTareaById);
router.post('/', createTarea);
router.put('/:id', updateTarea);
router.delete('/:id', deleteTarea);

export default router;