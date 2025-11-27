import express from 'express';
import { getEmpleados, getEmpleadoById, createEmpleado, updateEmpleado, deleteEmpleado } from '../controllers/empleadoController.js';
import { validate } from '../middleware/validate.js';
import { empleadoSchema } from '../validations/empleadoValidation.js';

const router = express.Router();

// Empleado routes
router.get('/', getEmpleados);
router.get('/:id', getEmpleadoById);
router.post('/', validate(empleadoSchema), createEmpleado);
router.put('/:id', validate(empleadoSchema), updateEmpleado);
router.delete('/:id', deleteEmpleado);

export default router;