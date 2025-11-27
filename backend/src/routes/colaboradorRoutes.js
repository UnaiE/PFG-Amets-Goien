import express from 'express';
import { getColaboradores, getColaboradorById, createColaborador, updateColaborador, deleteColaborador } from '../controllers/colaboradorController.js';
import { validate } from '../middleware/validate.js';
import { colaboradorSchema } from '../validations/colaboradorValidation.js';

const router = express.Router();

// Colaborador routes
router.get('/', getColaboradores);
router.get('/:id', getColaboradorById);
router.post('/', validate(colaboradorSchema), createColaborador);
router.put('/:id', validate(colaboradorSchema), updateColaborador);
router.delete('/:id', deleteColaborador);

export default router;