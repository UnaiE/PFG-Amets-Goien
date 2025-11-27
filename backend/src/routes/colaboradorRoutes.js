import express from 'express';
import { getColaboradores, getColaboradorById, createColaborador, updateColaborador, deleteColaborador } from '../controllers/colaboradorController.js';

const router = express.Router();

// Colaborador routes
router.get('/', getColaboradores);
router.get('/:id', getColaboradorById);
router.post('/', createColaborador);
router.put('/:id', updateColaborador);
router.delete('/:id', deleteColaborador);

export default router;