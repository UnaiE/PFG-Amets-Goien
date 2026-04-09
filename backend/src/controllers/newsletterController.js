import Colaborador from '../models/Colaborador.js';
import { sendEmail, isEmailConfigured } from '../services/mailer.js';

console.log('✅ Brevo API configurado para newsletters');

/**
 * @route GET /api/newsletter/colaboradores
 * @desc Obtener lista de colaboradores para newsletter (filtrado por tipo)
 * @access Private (admin, empleado)
 */
export const getColaboradoresNewsletter = async (req, res) => {
  try {
    const { tipo } = req.query; // 'monetario', 'voluntario', 'ambos', 'todos'

    let colaboradores = await Colaborador.getAll();
    
    // Filtrar por tipo si se especifica
    if (tipo && tipo !== 'todos') {
      if (tipo === 'monetario') {
        colaboradores = colaboradores.filter(c => 
          c.tipo_colaboracion === 'monetario' || c.tipo_colaboracion === 'ambos'
        );
      } else if (tipo === 'voluntario') {
        colaboradores = colaboradores.filter(c => 
          c.tipo_colaboracion === 'voluntario' || c.tipo_colaboracion === 'ambos'
        );
      } else {
        colaboradores = colaboradores.filter(c => c.tipo_colaboracion === tipo);
      }
    }

    // Filtrar solo los que tienen email
    colaboradores = colaboradores.filter(c => c.email && c.email.trim() !== '');

    res.status(200).json({ 
      total: colaboradores.length,
      colaboradores: colaboradores.map(c => ({
        id: c.id,
        nombre: c.nombre,
        apellidos: c.apellidos,
        email: c.email,
        tipo_colaboracion: c.tipo_colaboracion
      }))
    });
  } catch (error) {
    console.error('❌ Error al obtener colaboradores:', error);
    res.status(500).json({ message: 'Error al obtener colaboradores' });
  }
};

/**
 * @route POST /api/newsletter/send
 * @desc Enviar newsletter a colaboradores
 * @access Private (admin)
 */
export const sendNewsletter = async (req, res) => {
  try {
    const { asunto, mensaje, destinatarios_tipo, exclude_ids } = req.body;

    // Validaciones
    if (!asunto || !mensaje) {
      return res.status(400).json({ 
        message: 'El asunto y el mensaje son obligatorios' 
      });
    }

    if (!isEmailConfigured()) {
      return res.status(500).json({ 
        message: 'Configuración de email no disponible. Contacta al administrador del sistema.' 
      });
    }

    let destinatarios = [];

    // Obtener destinatarios según tipo
    let colaboradores = await Colaborador.getAll();
    
    // Filtrar por tipo
    if (destinatarios_tipo === 'monetario') {
      colaboradores = colaboradores.filter(c => 
        (c.tipo_colaboracion === 'monetario' || c.tipo_colaboracion === 'ambos') && c.email
      );
    } else if (destinatarios_tipo === 'voluntario') {
      colaboradores = colaboradores.filter(c => 
        (c.tipo_colaboracion === 'voluntario' || c.tipo_colaboracion === 'ambos') && c.email
      );
    } else if (destinatarios_tipo === 'ambos') {
      colaboradores = colaboradores.filter(c => 
        c.tipo_colaboracion === 'ambos' && c.email
      );
    } else if (destinatarios_tipo === 'todos') {
      colaboradores = colaboradores.filter(c => c.email);
    } else {
      colaboradores = colaboradores.filter(c => 
        c.tipo_colaboracion === destinatarios_tipo && c.email
      );
    }
    
    // Aplicar exclusiones manuales
    if (exclude_ids && Array.isArray(exclude_ids) && exclude_ids.length > 0) {
      const excludedCount = colaboradores.length;
      colaboradores = colaboradores.filter(c => !exclude_ids.includes(c.id));
      console.log(`📌 Excluidos ${excludedCount - colaboradores.length} destinatarios manualmente`);
    }
    
    destinatarios = colaboradores;

    if (destinatarios.length === 0) {
      return res.status(400).json({ 
        message: 'No hay destinatarios con email válido para enviar' 
      });
    }

    // Enviar emails
    const enviadosExitosos = [];
    const enviadosFallidos = [];

    for (const colaborador of destinatarios) {
      try {
        const mailOptions = {
          from: `"Ametsgoien" <${process.env.CONTACT_EMAIL}>`,
          to: colaborador.email,
          subject: asunto,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
              <div style="max-width: 600px; margin: 0 auto; background-color: white;">
                <!-- Header con logo -->
                <div style="text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #8A4D76 0%, #D8B8C4 100%); border-bottom: 2px solid #E8D5F2;">
                  <img src="${process.env.FRONTEND_URL || 'http://localhost:3000'}/logo.png" alt="Ametsgoien" style="max-width: 160px; height: auto; background: white; padding: 15px; border-radius: 10px;" />
                </div>
                
                <!-- Contenido -->
                <div style="padding: 40px 30px;">
                  <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Hola ${colaborador.nombre},</p>
                  
                  <div style="background-color: #E8D5F2; padding: 25px; border-radius: 10px; margin: 20px 0;">
                    <div style="background-color: white; padding: 20px; border-radius: 5px; color: #333; line-height: 1.6; white-space: pre-wrap;">${mensaje}</div>
                  </div>
                  
                  <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    Gracias por ser parte de nuestra comunidad.<br>
                    <strong style="color: #8A4D76;">Equipo de Ametsgoien</strong>
                  </p>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f8f8f8; padding: 25px 30px; text-align: center; border-top: 2px solid #E8D5F2;">
                  <p style="color: #666; font-size: 12px; margin: 5px 0;">
                    <strong>Ametsgoien - Asociación sin ánimo de lucro</strong><br>
                    Acogida, dignidad y acompañamiento
                  </p>
                  <p style="color: #999; font-size: 11px; margin: 10px 0;">
                    Orduña, Vizcaya | <a href="mailto:ametsgoien@gmail.com" style="color: #8A4D76; text-decoration: none;">ametsgoien@gmail.com</a>
                  </p>
                  <p style="color: #999; font-size: 10px; margin: 15px 0 0 0;">
                    Recibiste este email porque eres colaborador/a de Ametsgoien.<br>
                    Si no deseas recibir más comunicaciones, contacta con nosotros.
                  </p>
                </div>
              </div>
            </body>
            </html>
          `
        };

        await sendEmail({
          to: colaborador.email,
          from: process.env.CONTACT_EMAIL,
          subject: asunto,
          html: mailOptions.html
        });
        
        enviadosExitosos.push({ 
          email: colaborador.email, 
          nombre: `${colaborador.nombre} ${colaborador.apellidos}` 
        });
        
        // Pequeño delay para no saturar el servidor SMTP
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (emailError) {
        console.error(`❌ Error enviando a ${colaborador.email}:`, emailError);
        enviadosFallidos.push({ 
          email: colaborador.email, 
          nombre: `${colaborador.nombre} ${colaborador.apellidos}`,
          error: emailError.message 
        });
      }
    }

    res.status(200).json({
      message: `Newsletter enviada: ${enviadosExitosos.length} exitosos, ${enviadosFallidos.length} fallidos`,
      exitosos: enviadosExitosos.length,
      fallidos: enviadosFallidos.length,
      detalles: {
        enviadosExitosos,
        enviadosFallidos
      }
    });

  } catch (error) {
    console.error('❌ Error al enviar newsletter:', error);
    res.status(500).json({ 
      message: 'Error al enviar newsletter',
      error: error.message 
    });
  }
};

/**
 * @route POST /api/newsletter/test
 * @desc Enviar email de prueba al administrador
 * @access Private (admin)
 */
export const sendTestEmail = async (req, res) => {
  try {
    const { asunto, mensaje } = req.body;

    if (!isEmailConfigured()) {
      return res.status(500).json({ 
        message: 'Configuración de email no disponible' 
      });
    }

    // Usar CONTACT_EMAIL como destinatario y remitente (debe estar verificado en Brevo)
    const destinatario = process.env.CONTACT_EMAIL;

    if (!destinatario) {
      return res.status(500).json({ 
        message: 'CONTACT_EMAIL no está configurado en las variables de entorno' 
      });
    }

    const mailOptions = {
      from: `"Ametsgoien" <${process.env.CONTACT_EMAIL}>`,
      to: destinatario,
      subject: `[PRUEBA] ${asunto}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid #E8D5F2;">
            <img src="${process.env.FRONTEND_URL || 'http://localhost:3000'}/logo.png" alt="Ametsgoien" style="max-width: 180px; height: auto;" />
          </div>
          <div style="background-color: #FFF9C4; padding: 20px; border-radius: 10px; border-left: 4px solid #FBC02D; margin-bottom: 20px;">
            <h3 style="color: #F57C00; margin-top: 0;">🚧 EMAIL DE PRUEBA</h3>
            <p style="margin: 0; color: #666;">Este es un envío de prueba. No se ha enviado a ningún colaborador.</p>
          </div>
          <h2 style="color: #8A4D76;">${asunto}</h2>
          <div style="background-color: #E8D5F2; padding: 20px; border-radius: 10px;">
            <div style="background-color: white; padding: 15px; border-radius: 5px; white-space: pre-wrap; color: #333;">${mensaje}</div>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px; text-align: center;">
            Vista previa del newsletter que recibirían los colaboradores<br>
            Enviado a: ${destinatario}
          </p>
        </div>
      `
    };

    await sendEmail({
      to: destinatario,
      from: process.env.CONTACT_EMAIL,
      subject: mailOptions.subject,
      html: mailOptions.html
    });

    res.status(200).json({ 
      message: '✅ Email de prueba enviado exitosamente a ' + destinatario
    });

  } catch (error) {
    console.error('❌ Error al enviar email de prueba:', error);
    res.status(500).json({ 
      message: 'Error al enviar email de prueba',
      error: error.message 
    });
  }
};
