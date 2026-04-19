import type { Metadata, Viewport } from 'next'
import './globals.css'
import { StoreProvider } from '@/context/StoreContext'

export const metadata: Metadata = {
  title: 'RinoSteam — Juegos Steam hasta 90% más baratos',
  description:
    'Tienda de cuentas Steam con descuentos de hasta 90%. Accedes primero, pagas después. Chile y Venezuela.',
  keywords: ['steam', 'juegos', 'descuentos', 'cuentas steam', 'rinosteam'],
  openGraph: {
    title: 'RinoSteam — Juegos hasta 90% más baratos',
    description: 'Accedes primero, pagas después. Sin riesgo de estafa.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#08040200',
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
          <div className="mx-auto max-w-mobile min-h-screen relative">
            {children}
          </div>
        </StoreProvider>
      </body>
    </html>
  )
}
