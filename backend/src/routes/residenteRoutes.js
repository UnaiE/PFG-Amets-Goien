import express from 'express';
import { getResidentes, getResidenteById, deleteResidente, updateResidente, createResidente } from '../controllers/residenteController.js';

const router = express.Router();

// Residente routes
router.get('/', getResidentes);
router.get('/:id', getResidenteById);
router.post('/', createResidente);
router.put('/:id', updateResidente);
router.delete('/:id', deleteResidente);

export default router;