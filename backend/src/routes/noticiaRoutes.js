import express from 'express';
import { getNoticias, getNoticiaById, updateNoticia, deleteNoticia, createNoticia } from '../controllers/noticiaController.js';
import { validate } from '../middleware/validate.js';
import { noticiaSchema } from '../validations/noticiaValidation.js';

const router = express.Router();

// Noticia routes
router.get('/', getNoticias);
router.get('/:id', getNoticiaById);
router.post('/', validate(noticiaSchema), createNoticia);
router.put('/:id', validate(noticiaSchema), updateNoticia);
router.delete('/:id', deleteNoticia);

export default router;