import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import userRoutes from './routes/userRoutes.js';
import actividadRoutes from './routes/actividadRoutes.js';
import colaboradorRoutes from './routes/colaboradorRoutes.js';
import empleadoRoutes from './routes/empleadoRoutes.js';
import noticiaRoutes from './routes/noticiaRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';
import residenteRoutes from './routes/residenteRoutes.js';
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(rateLimit({windowMs: 15 * 60 * 1000, max: 100}));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/colaboradores', colaboradorRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/noticias', noticiaRoutes);
app.use('/api/tareas', tareaRoutes);
app.use('/api/residentes', residenteRoutes);
app.use('/api/actividades', actividadRoutes);

export default app;
