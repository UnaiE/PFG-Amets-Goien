import { createTransport } from "nodemailer";
import { contactoSchema } from "../validations/contactoValidation.js";

// Configurar el transporter de nodemailer con timeout reducido
const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    connectionTimeout: 10000, // 10 segundos
    greetingTimeout: 10000,   // 10 segundos
    socketTimeout: 10000,     // 10 segundos
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  };

  console.log("SMTP Config:", {
    host: config.host,
    port: config.port,
    user: config.auth.user,
    passLength: config.auth.pass ? config.auth.pass.length : 0
  });

  return createTransport(config);
};

const transporter = createTransporter();

// Verificar la conexión SMTP al iniciar (no bloqueante)
transporter.verify()
  .then(() => {
    console.log("✅ Servidor SMTP listo para enviar emails");
  })
  .catch((error) => {
    console.error("⚠️ Error en la configuración SMTP:", error.message);
    console.log("El servidor continuará funcionando, pero los emails pueden fallar");
  });

export const enviarContacto = async (req, res) => {
  try {
    console.log("📨 Datos recibidos del formulario de contacto:", req.body);
    
    // Validar los datos del formulario
    const { error, value } = contactoSchema.validate(req.body);
    
    if (error) {
      console.error("❌ Validación fallida:", error.details.map(d => d.message));
      return res.status(400).json({
        message: "Datos inválidos",
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    const { nombre, apellidos, email, mensaje } = value;

    // Configurar el email para el administrador
    const mailOptionsAdmin = {
      from: `"Formulario Ametsgoien" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject: `Nuevo mensaje de contacto: ${nombre} ${apellidos}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid #E8D5F2;">
            <img src="${process.env.FRONTEND_URL || 'http://localhost:3000'}/logo.png" alt="Ametsgoien" style="max-width: 180px; height: auto;" />
          </div>
          <h2 style="color: #8A4D76;">Nuevo mensaje de contacto</h2>
          <div style="background-color: #E8D5F2; padding: 20px; border-radius: 10px;">
            <p><strong>Nombre:</strong> ${nombre} ${apellidos}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mensaje:</strong></p>
            <p style="background-color: white; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${mensaje}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Este mensaje fue enviado desde el formulario de contacto de Ametsgoien.
          </p>
        </div>
      `
    };

    // Configurar el email de confirmación para el usuario
    const mailOptionsUsuario = {
      from: `"Ametsgoien" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Hemos recibido tu mensaje - Ametsgoien",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid #E8D5F2;">
            <img src="${process.env.FRONTEND_URL || 'http://localhost:3000'}/logo.png" alt="Ametsgoien" style="max-width: 180px; height: auto;" />
          </div>
          <h2 style="color: #8A4D76;">¡Gracias por contactarnos!</h2>
          <div style="background-color: #E8D5F2; padding: 20px; border-radius: 10px;">
            <p>Hola ${nombre},</p>
            <p>Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.</p>
            <p><strong>Tu mensaje:</strong></p>
            <p style="background-color: white; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${mensaje}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Este es un mensaje automático. Por favor, no respondas a este correo.
          </p>
        </div>
      `
    };

    // Enviar ambos emails con timeout de 10 segundos
    const sendEmailWithTimeout = async (mailOptions, timeout = 10000) => {
      return Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email timeout')), timeout)
        )
      ]);
    };

    try {
      await Promise.all([
        sendEmailWithTimeout(mailOptionsAdmin),
        sendEmailWithTimeout(mailOptionsUsuario)
      ]);
      console.log(`✅ Email de contacto enviado correctamente a ${email}`);
    } catch (emailError) {
      console.error("❌ Error enviando email de contacto:", emailError);
      // NO fallar el endpoint - registrar el mensaje en consola
      console.log("📝 Mensaje de contacto recibido (email falló):", {
        nombre: `${nombre} ${apellidos}`,
        email,
        mensaje: mensaje.substring(0, 100) + "..."
      });
    }

    // Siempre responder exitosamente al usuario
    res.status(200).json({
      message: "Mensaje recibido correctamente. Te contactaremos pronto.",
      success: true
    });

  } catch (error) {
    console.error("Error al procesar el contacto:", error);
    res.status(500).json({
      message: "Error al procesar el mensaje. Por favor, inténtalo de nuevo más tarde.",
      error: error.message
    });
  }
};
