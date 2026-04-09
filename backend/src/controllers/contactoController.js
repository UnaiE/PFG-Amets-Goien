import { contactoSchema } from "../validations/contactoValidation.js";
import { sendEmail, isEmailConfigured } from '../services/mailer.js';

console.log('✅ Brevo API configurado para emails de contacto');

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
      from: `"Formulario Ametsgoien" <${process.env.CONTACT_EMAIL}>`,
      to: process.env.CONTACT_EMAIL,
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
      from: `"Ametsgoien" <${process.env.CONTACT_EMAIL}>`,
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

    if (!isEmailConfigured()) {
      console.error('❌ Configuración de Brevo incompleta para correo de contacto');
      console.log("📝 Mensaje de contacto recibido (email deshabilitado por configuración):", {
        nombre: `${nombre} ${apellidos}`,
        email,
        mensaje: mensaje.substring(0, 100) + "..."
      });
      return res.status(200).json({
        message: "Mensaje recibido correctamente. Te contactaremos pronto.",
        success: true
      });
    }

    // Enviar emails usando Brevo API
    try {
      await Promise.all([
        sendEmail({
          to: mailOptionsAdmin.to,
          from: mailOptionsAdmin.from,
          subject: mailOptionsAdmin.subject,
          html: mailOptionsAdmin.html,
          replyTo: email
        }),
        sendEmail({
          to: mailOptionsUsuario.to,
          from: mailOptionsUsuario.from,
          subject: mailOptionsUsuario.subject,
          html: mailOptionsUsuario.html
        })
      ]);
      console.log(`✅ Emails de contacto enviados correctamente`);
    } catch (emailError) {
      console.error("❌ Error enviando email de contacto:");
      console.error("Error completo:", emailError);
      
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
