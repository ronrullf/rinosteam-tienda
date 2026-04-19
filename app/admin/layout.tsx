import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RinoSteam Admin',
  description: 'Panel de administración de RinoSteam',
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
