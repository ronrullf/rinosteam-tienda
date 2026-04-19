'use client'

const TESTIMONIALS = [
  { user: '@carlos_gamer89',    stars: 5, text: 'Servicio demasiado bueno 100% recomendados, mucha confianza y rapidez 🔥', flag: '🇻🇪' },
  { user: '@josebellidoarroyo', stars: 5, text: 'Lo recomiendo 100% confiable, he hecho más de 50 compras con ellos', flag: '🇻🇪' },
  { user: '@maderoandy7',       stars: 5, text: 'Excelente servicio, compré Black Myth Wukong y sin problemas 💕', flag: '🇨🇱' },
  { user: '@luisito_gamer',     stars: 5, text: 'El proceso es súper sencillo, compré RE4 Remake y está perfecta la cuenta 💯', flag: '🇨🇱' },
  { user: '@pepito_plays',      stars: 5, text: 'Ya llevo más de 10 juegos comprados, nunca he tenido ningún problema', flag: '🇻🇪' },
  { user: '@mariela_ve2024',    stars: 5, text: 'Me enviaron la cuenta al momento, descargué el juego sin ningún problema ✅', flag: '🇻🇪' },
  { user: '@dark_wolf_cl',      stars: 5, text: 'Los mejores precios que he encontrado, y el servicio es rapidísimo ⚡', flag: '🇨🇱' },
]

function StarRating({ count }: { count: number }) {
  return (
    <span style={{ color: '#FCD34D', fontSize: '12px' }}>{'★'.repeat(count)}</span>
  )
}

export function TestimonialsCarousel() {
  // Duplicate for infinite scroll
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS]

  return (
    <section
      className="py-6 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-surface)' }}
    >
      <div className="max-w-7xl mx-auto px-4 mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--orange-500)' }}
          />
          <p className="font-sans text-[12px] font-semibold uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}>
            📸 Comentarios reales de Instagram
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Left/right fade gradients */}
        <div
          className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--bg-surface), transparent)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--bg-surface), transparent)' }}
        />

        {/* Scrolling track */}
        <div className="flex animate-marquee">
          {doubled.map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-2 rounded-xl border p-4"
              style={{
                width: '260px',
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366)',
                    color: '#fff',
                  }}
                >
                  {t.user[1].toUpperCase()}
                </div>
                <div>
                  <p className="font-sans text-[12px] font-semibold leading-none mb-0.5"
                    style={{ color: 'var(--text-primary)' }}>
                    {t.user} {t.flag}
                  </p>
                  <StarRating count={t.stars} />
                </div>
              </div>
              <p className="font-sans text-[13px] leading-snug"
                style={{ color: 'var(--text-secondary)' }}>
                &ldquo;{t.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
