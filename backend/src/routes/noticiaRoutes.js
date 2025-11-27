import express from 'express';
import { getNoticias, getNoticiaById, updateNoticia, deleteNoticia, createNoticia } from '../controllers/noticiaController.js';

const router = express.Router();

// Noticia routes
router.get('/', getNoticias);
router.get('/:id', getNoticiaById);
router.post('/', createNoticia);
router.put('/:id', updateNoticia);
router.delete('/:id', deleteNoticia);

export default router;