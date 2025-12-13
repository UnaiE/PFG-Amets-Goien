import express from "express";
import { enviarContacto } from "../controllers/contactoController.js";

const router = express.Router();

// POST /api/contacto - Enviar formulario de contacto
router.post("/", enviarContacto);

export default router;
