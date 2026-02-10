import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ametsgoien - Asociación de ayuda a mujeres migrantes',
    short_name: 'Ametsgoien',
    description: 'Asociación sin ánimo de lucro dedicada a proporcionar acogida, apoyo integral y acompañamiento a mujeres migrantes y sus familias en situación de vulnerabilidad.',
    start_url: '/',
    display: 'standalone',
    background_color: '#D8B8C4',
    theme_color: '#8A4D76',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
