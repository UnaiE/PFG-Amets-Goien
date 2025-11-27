import express from 'express';
import { getActividades, getActividadById, createActividad, updateActividad, deleteActividad } from '../controllers/actividadController.js';

const router = express.Router();

// Actividad routes
router.get('/', getActividades);
router.get('/:id', getActividadById);
router.post('/', createActividad);
router.put('/:id', updateActividad);
router.delete('/:id', deleteActividad);

export default router;