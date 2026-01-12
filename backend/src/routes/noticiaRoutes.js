import express from 'express';
import { getNoticias, getNoticiaById, updateNoticia, deleteNoticia, createNoticia } from '../controllers/noticiaController.js';
import { validate } from '../middleware/validate.js';
import { noticiaSchema } from '../validations/noticiaValidation.js';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// Rutas públicas para la web principal
router.get('/', getNoticias);
router.get('/:id', getNoticiaById);

// Rutas protegidas para el panel de administración
router.post('/', auth, checkRole('admin', 'empleado', 'user'), validate(noticiaSchema), createNoticia);
router.put('/:id', auth, checkRole('admin', 'empleado', 'user'), validate(noticiaSchema), updateNoticia);
router.delete('/:id', auth, checkRole('admin'), deleteNoticia);

export default router;