import sgMail from '@sendgrid/mail';

// Configurar SendGrid con API Key
sgMail.setApiKey(process.env.SMTP_PASS); // SMTP_PASS contiene la API key de SendGrid

console.log('✅ SendGrid configurado con API Key');

/**
 * Enviar email de confirmación de donación
 */
export const enviarEmailDonacion = async ({ 
  email, 
  nombre, 
  cantidad, 
  periodicidad, 
  stripeSubscriptionId 
}) => {
  try {
    const esRecurrente = periodicidad !== 'puntual';
    const periodicidadTexto = {
      'puntual': 'única',
      'mensual': 'mensual',
      'trimestral': 'trimestral',
      'semestral': 'semestral',
      'anual': 'anual'
    }[periodicidad] || 'única';

    // Crear enlace al portal de facturación de Stripe si es recurrente
    let billingPortalUrl = '#';
    if (esRecurrente && stripeSubscriptionId) {
      try {
        const stripe = (await import('stripe')).default;
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
        
        // Obtener el customer de la suscripción
        const subscription = await stripeInstance.subscriptions.retrieve(stripeSubscriptionId);
        
        // Crear sesión del portal de facturación
        const portalSession = await stripeInstance.billingPortal.sessions.create({
          customer: subscription.customer,
          return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/colaborar`,
        });
        
        billingPortalUrl = portalSession.url;
      } catch (error) {
        console.error('Error creando portal de facturación:', error);
      }
    }

    const htmlRecurrente = esRecurrente ? `
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #8A4D76; margin: 0 0 10px 0;">📋 Detalles de tu suscripción</h3>
        <p style="margin: 5px 0;"><strong>Periodicidad:</strong> ${periodicidadTexto}</p>
        <p style="margin: 5px 0;"><strong>Importe:</strong> ${cantidad}€ cada periodo</p>
        <p style="margin: 5px 0; color: #666; font-size: 14px;">
          Los cargos se realizarán automáticamente según la periodicidad seleccionada.
        </p>
      </div>
      
      <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
        <h3 style="color: #92400e; margin: 0 0 10px 0;">🔄 Gestión de tu suscripción</h3>
        <p style="margin: 5px 0; color: #78350f;">
          Puedes cancelar tu suscripción en cualquier momento sin penalización. 
          Gestiona tu suscripción desde el portal de Stripe o contáctanos directamente.
        </p>
        <p style="margin: 10px 0 5px 0;">
          <a href="${billingPortalUrl}" 
             style="background-color: #635BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-right: 10px;">
            Gestionar Suscripción
          </a>
          <a href="mailto:${process.env.CONTACT_EMAIL || 'info@ametsgoien.org'}" 
             style="background-color: #8A4D76; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Contactar
          </a>
        </p>
      </div>
    ` : `
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Tipo de donación:</strong> Donación única</p>
        <p style="margin: 5px 0;"><strong>Importe:</strong> ${cantidad}€</p>
      </div>
    `;

    const mailOptions = {
      from: `"Ametsgoien Asociación" <${process.env.CONTACT_EMAIL}>`,
      to: email,
      subject: esRecurrente 
        ? `🎉 ¡Gracias por tu donación recurrente! - Ametsgoien` 
        : `🎉 ¡Gracias por tu donación! - Ametsgoien`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #E8D5F2;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; margin-top: 20px; margin-bottom: 20px;">
            
            <!-- Logo -->
            <div style="text-align: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid #E8D5F2;">
              <img src="${process.env.FRONTEND_URL || 'http://localhost:3000'}/logo.png" alt="Ametsgoien" style="max-width: 200px; height: auto;" />
            </div>

            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #8A4D76; margin: 0; font-size: 28px;">¡Gracias ${nombre}!</h1>
              <p style="color: #666; margin-top: 10px; font-size: 16px;">
                Tu generosidad hace la diferencia
              </p>
            </div>

            <!-- Mensaje principal -->
            <div style="margin-bottom: 20px;">
              <p style="font-size: 16px; line-height: 1.6; color: #333;">
                Hemos recibido tu donación correctamente. Gracias por confiar en Ametsgoien  
                y por contribuir a nuestra misión de ofrecer acogida, dignidad y acompañamiento 
                a mujeres refugiadas y sus hijos en nuestra casa de Orduña.
              </p>
            </div>

            <!-- Detalles de la donación -->
            ${htmlRecurrente}

            <!-- Información adicional -->
            <div style="background-color: #E8D5F2; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #8A4D76; margin: 0 0 10px 0;">💜 Tu impacto</h3>
              <p style="margin: 5px 0; color: #333;">
                Tu donación nos ayuda a:
              </p>
              <ul style="margin: 10px 0; padding-left: 20px; color: #333;">
                <li>Mantener nuestra casa de acogida de 12 habitaciones en Orduña</li>
                <li>Proporcionar refugio seguro y digno a mujeres refugiadas con sus hijos</li>
                <li>Ofrecer apoyo psicológico y acompañamiento humano personalizado</li>
                <li>Cubrir gastos de alimentación, material escolar y necesidades básicas</li>
                <li>Facilitar su integración social con amor y solidaridad</li>
              </ul>
              <p style="margin: 10px 0; padding: 10px; background-color: #f9fafb; border-left: 3px solid #8A4D76; color: #333; font-style: italic; font-size: 14px;">
                "Gota a gota, construimos con amor un refugio donde cada mujer puede reencontrar su dignidad y esperanza."
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #8A4D76; font-size: 16px; font-weight: bold; margin: 5px 0;">
                Asociación Ametsgoien
              </p>
              <p style="color: #666; font-size: 13px; margin: 5px 0;">
                Acogida, dignidad y acompañamiento • Orduña, Bizkaia
              </p>
              <p style="color: #666; font-size: 14px; margin: 15px 0 5px 0;">
                Si tienes alguna pregunta, no dudes en contactarnos
              </p>
              <p style="margin: 5px 0;">
                <a href="mailto:ametsgoien@gmail.com" 
                   style="color: #8A4D76; text-decoration: none; font-weight: 500;">
                  📧 ametsgoien@gmail.com
                </a>
              </p>
              <p style="margin: 5px 0;">
                <a href="tel:+34697858343" 
                   style="color: #8A4D76; text-decoration: none; font-weight: 500;">
                  📱 +34 697 858 343
                </a>
              </p>
              <p style="margin: 15px 0 5px 0;">
                <a href="https://www.instagram.com/ametsgoien/" 
                   style="color: #8A4D76; text-decoration: none; font-size: 13px;">
                  📷 @ametsgoien
                </a>
              </p>
            </div>

          </div>
        </body>
        </html>
      `
    };

    const msg = {
      to: email,
      from: process.env.CONTACT_EMAIL,
      subject: mailOptions.subject,
      html: mailOptions.html
    };

    await sgMail.send(msg);
    console.log('✅ Email de confirmación enviado a', email);
    return { success: true };

  } catch (error) {
    console.error('❌ Error enviando email de confirmación:', error);
    // No lanzar error para que no falle la donación si falla el email
    return { success: false, error: error.message };
  }
};

export default { enviarEmailDonacion };
