import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import Donacion from './models/Donacion.js';

const PORT = process.env.PORT || 4000;
const HOST = '0.0.0.0'; // Necesario para Railway y otros servicios cloud

const toPositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const pendingExpiryMinutes = toPositiveInt(process.env.DONATION_PENDING_EXPIRY_MINUTES, 120);
const deleteExpiradaHours = toPositiveInt(process.env.DONATION_DELETE_EXPIRADA_HOURS, 24);
const deleteFallidaHours = toPositiveInt(process.env.DONATION_DELETE_FALLIDA_HOURS, 72);
const cleanupIntervalMinutes = toPositiveInt(process.env.DONATION_CLEANUP_INTERVAL_MINUTES, 30);

const runDonationCleanup = async () => {
  try {
    const expired = await Donacion.expireOldPending(pendingExpiryMinutes);
    const deleted = await Donacion.deleteOldTransient({
      expiradaHours: deleteExpiradaHours,
      fallidaHours: deleteFallidaHours
    });

    if (expired.count > 0 || deleted.count > 0) {
      console.log(
        `🧹 Limpieza donaciones: expiradas=${expired.count}, eliminadas=${deleted.count} ` +
        `(expirada=${deleted.deletedByState.expirada}, fallida=${deleted.deletedByState.fallida})`
      );
    }
  } catch (error) {
    console.warn('⚠️ No se pudo ejecutar la limpieza automática de donaciones:', error.message);
  }
};

const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Backend is running on ${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);

  // Ejecuta limpieza periódica sin bloquear el flujo principal.
  setTimeout(() => {
    runDonationCleanup();
  }, 30 * 1000);

  const cleanupTimer = setInterval(runDonationCleanup, cleanupIntervalMinutes * 60 * 1000);
  if (typeof cleanupTimer.unref === 'function') {
    cleanupTimer.unref();
  }
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
});