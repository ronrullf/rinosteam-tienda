import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/store/Header'
import { HeroSection } from '@/components/store/HeroSection'
import { TrustBanner } from '@/components/store/TrustBanner'
import { GameGridContainer } from '@/components/store/GameGridContainer'
import { CountryModal } from '@/components/store/CountryModal'
import { Footer } from '@/components/store/Footer'
import type { Game } from '@/types'

// Siempre renderizar en servidor (usa cookies de Supabase SSR)
export const dynamic = 'force-dynamic'

async function getGames(): Promise<Game[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching games:', error.message)
      return []
    }

    return data ?? []
  } catch (err) {
    // Supabase no configurado aún — devolver lista vacía
    console.warn('Supabase not configured:', err)
    return []
  }
}

export default async function HomePage() {
  const games = await getGames()

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <TrustBanner />
        <GameGridContainer initialGames={games} />
      </main>
      <Footer />
      <CountryModal />
    </>
  )
}
