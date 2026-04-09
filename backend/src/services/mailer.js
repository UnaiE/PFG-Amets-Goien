function parseFromAddress(fromValue) {
  if (!fromValue) {
    const fallbackEmail = process.env.CONTACT_EMAIL;
    if (!fallbackEmail) {
      throw new Error('CONTACT_EMAIL no está configurado en las variables de entorno');
    }
    return {
      email: fallbackEmail,
      name: process.env.CONTACT_NAME || 'Ametsgoien',
    };
  }

  if (typeof fromValue === 'object' && fromValue.email) {
    return {
      email: fromValue.email,
      name: fromValue.name || process.env.CONTACT_NAME || 'Ametsgoien',
    };
  }

  const fromText = String(fromValue);
  const match = fromText.match(/^(?:"?([^"<]+)"?\s*)?<([^>]+)>$/);

  if (match) {
    return {
      name: (match[1] || process.env.CONTACT_NAME || 'Ametsgoien').trim(),
      email: match[2].trim(),
    };
  }

  return {
    email: fromText.trim(),
    name: process.env.CONTACT_NAME || 'Ametsgoien',
  };
}

function toBrevoRecipients(value) {
  const recipients = Array.isArray(value) ? value : [value];

  return recipients
    .filter(Boolean)
    .map((recipient) => {
      if (typeof recipient === 'string') {
        return { email: recipient };
      }

      return {
        email: recipient.email,
        name: recipient.name,
      };
    })
    .filter((recipient) => Boolean(recipient.email));
}

function buildBrevoPayload(mailOptions) {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    throw new Error('Falta configuración Brevo: BREVO_API_KEY es obligatoria');
  }

  const sender = parseFromAddress(mailOptions.from || process.env.CONTACT_EMAIL);
  const to = toBrevoRecipients(mailOptions.to);

  if (to.length === 0) {
    throw new Error('No hay destinatarios válidos para el correo');
  }

  const payload = {
    sender,
    to,
    subject: mailOptions.subject,
    htmlContent: mailOptions.html || '',
  };

  if (mailOptions.text) {
    payload.textContent = mailOptions.text;
  }

  if (mailOptions.replyTo) {
    payload.replyTo = typeof mailOptions.replyTo === 'string'
      ? { email: mailOptions.replyTo }
      : mailOptions.replyTo;
  }

  if (mailOptions.headers) {
    payload.headers = mailOptions.headers;
  }

  return { apiKey, payload };
}

export async function sendEmail(mailOptions) {
  const { apiKey, payload } = buildBrevoPayload(mailOptions);

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Brevo API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

export function isEmailConfigured() {
  return Boolean(process.env.BREVO_API_KEY && process.env.CONTACT_EMAIL);
}