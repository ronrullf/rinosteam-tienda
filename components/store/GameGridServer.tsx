import { createClient } from '@/lib/supabase/server'
import { GameGridContainer } from './GameGridContainer'
import type { Game } from '@/types'

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
  } catch {
    return []
  }
}

/** Server Component — se ejecuta en el servidor, envia datos al cliente */
export async function GameGridServer() {
  const games = await getGames()
  return <GameGridContainer initialGames={games} />
}
