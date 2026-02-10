/**
 * @file ContactoPage - Página de Formulario de Contacto
 * @route /contacto
 * @description Formulario de contacto público con envío de emails vía SMTP
 */
import { Metadata } from 'next';
import ContactoClient from '@/components/ContactoClient';

export const metadata: Metadata = {
  title: 'Contacto - Ponte en contacto con nosotros',
  description: 'Contacta con Ametsgoien para cualquier consulta, colaboración o solicitud de información. Estamos aquí para ayudarte. Email: ametsgoien@gmail.com',
  keywords: ['contacto ametsgoien', 'email', 'consultas', 'información', 'Bilbao'],
  openGraph: {
    title: 'Contacto - Ametsgoien',
    description: 'Ponte en contacto con nosotros para consultas, colaboraciones o más información.',
  },
};

export default function ContactoPage() {
  return <ContactoClient />;
}
