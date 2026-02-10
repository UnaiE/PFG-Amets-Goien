/**
 * @file ColaborarPage - Página de Donaciones y Colaboración
 * @route /colaborar
 * @description Página para realizar donaciones mediante Bizum o tarjeta, guardando datos del colaborador
 */
import { Metadata } from 'next';
import ColaborarClient from '@/components/ColaborarClient';

export const metadata: Metadata = {
  title: 'Colabora con Nosotros - Donaciones',
  description: 'Ayúdanos a seguir apoyando a mujeres migrantes. Realiza tu donación mediante Bizum o tarjeta de forma segura. Cada aportación marca la diferencia en la vida de familias necesitadas.',
  keywords: ['donar ametsgoien', 'colaborar', 'donación', 'bizum', 'ayuda mujeres', 'solidaridad', 'voluntariado'],
  openGraph: {
    title: 'Colabora con Ametsgoien',
    description: 'Tu donación ayuda a proporcionar acogida y apoyo a mujeres migrantes en situación de vulnerabilidad.',
  },
};

export default function ColaborarPage() {
  return <ColaborarClient />;
}
