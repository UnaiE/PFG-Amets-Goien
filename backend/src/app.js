import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import actividadRoutes from './routes/actividadRoutes.js';
import colaboradorRoutes from './routes/colaboradorRoutes.js';
import empleadoRoutes from './routes/empleadoRoutes.js';
import noticiaRoutes from './routes/noticiaRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';
import residenteRoutes from './routes/residenteRoutes.js';
import contactoRoutes from './routes/contactoRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();

// CORS simple
app.use(cors());

// Parse JSON (excepto para webhook de Stripe)
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payment/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/colaboradores', colaboradorRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/noticias', noticiaRoutes);
app.use('/api/tareas', tareaRoutes);
app.use('/api/residentes', residenteRoutes);
app.use('/api/actividades', actividadRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/payment', paymentRoutes);

export default app;
