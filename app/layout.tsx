import type { Metadata, Viewport } from 'next'
import './globals.css'
import { StoreProvider } from '@/context/StoreContext'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rinosteam.com'
  ),
  title: 'RinoSteam — Juegos Steam hasta 90% más baratos',
  description:
    'Tienda de cuentas Steam con descuentos de hasta 90%. Accedes primero, pagas después. Chile y Venezuela.',
  keywords: ['steam', 'juegos', 'descuentos', 'cuentas steam', 'rinosteam'],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'RinoSteam — Juegos hasta 90% más baratos',
    description: 'Accedes primero, pagas después. Sin riesgo de estafa.',
    type: 'website',
    images: ['/logo.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080402',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
        <Analytics />
      </body>
    </html>
  )
}
