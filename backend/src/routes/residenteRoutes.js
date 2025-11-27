import express from 'express';
import { getResidentes, getResidenteById, deleteResidente, updateResidente, createResidente } from '../controllers/residenteController.js';
import { validate } from '../middleware/validate.js';
import { residenteSchema } from '../validations/residenteValidation.js';

const router = express.Router();

// Residente routes
router.get('/', getResidentes);
router.get('/:id', getResidenteById);
router.post('/', validate(residenteSchema), createResidente);
router.put('/:id', validate(residenteSchema), updateResidente);
router.delete('/:id', deleteResidente);

export default router;