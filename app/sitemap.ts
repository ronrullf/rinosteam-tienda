import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rinosteam.com'

  // Páginas estáticas
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  // Páginas de juegos activos
  try {
    const supabase = await createClient()
    const { data: games } = await supabase
      .from('games')
      .select('slug, updated_at')
      .eq('is_active', true)

    const gameRoutes: MetadataRoute.Sitemap = (games ?? []).map((g) => ({
      url: `${base}/game/${g.slug}`,
      lastModified: new Date(g.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [...staticRoutes, ...gameRoutes]
  } catch {
    return staticRoutes
  }
}
