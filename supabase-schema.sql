-- ============================================================
-- RINOSTEAM — Esquema de base de datos Supabase
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- Tabla principal de juegos
CREATE TABLE IF NOT EXISTS games (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT,
  original_price  NUMERIC(10,2) NOT NULL,
  sale_price      NUMERIC(10,2) NOT NULL,
  discount_pct    INTEGER GENERATED ALWAYS AS
                  (ROUND((1 - sale_price / original_price) * 100)) STORED,
  image_url       TEXT NOT NULL,
  category        TEXT DEFAULT 'Acción',
  is_active       BOOLEAN DEFAULT true,
  is_featured     BOOLEAN DEFAULT false,
  stock_note      TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_games_active ON games (is_active);
CREATE INDEX IF NOT EXISTS idx_games_category ON games (category);
CREATE INDEX IF NOT EXISTS idx_games_slug ON games (slug);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Lectura pública solo de juegos activos
CREATE POLICY "Public read active games"
  ON games FOR SELECT
  USING (is_active = true);

-- Admin autenticado tiene acceso completo (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Admin full access"
  ON games FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE: bucket game-images
-- Ejecutar en Supabase Dashboard > Storage > New Bucket
-- Nombre: game-images | Public: true
-- ============================================================

-- Política storage: lectura pública
-- INSERT INTO storage.buckets (id, name, public) VALUES ('game-images', 'game-images', true);

-- ============================================================
-- DATOS DE PRUEBA (opcional)
-- ============================================================

INSERT INTO games (title, slug, description, original_price, sale_price, image_url, category, is_featured, is_active, stock_note)
VALUES
  (
    'Resident Evil 4 Remake',
    'resident-evil-4-remake',
    'El legendario survival horror reimaginado con gráficos modernos.',
    59.99,
    4.99,
    'https://placehold.co/400x500/1a0500/F97316?text=RE4+Remake',
    'Terror',
    true,
    true,
    '¡Pocas cuentas disponibles!'
  ),
  (
    'Elden Ring',
    'elden-ring',
    'El RPG de acción de FromSoftware y George R.R. Martin.',
    59.99,
    6.99,
    'https://placehold.co/400x500/0a0400/F97316?text=Elden+Ring',
    'RPG',
    false,
    true,
    NULL
  ),
  (
    'Cyberpunk 2077',
    'cyberpunk-2077',
    'RPG de mundo abierto ambientado en Night City.',
    59.99,
    5.49,
    'https://placehold.co/400x500/060a15/F97316?text=Cyberpunk+2077',
    'RPG',
    false,
    true,
    NULL
  ),
  (
    'GTA V Premium',
    'gta-v-premium',
    'El juego de mundo abierto más vendido de todos los tiempos.',
    29.99,
    2.99,
    'https://placehold.co/400x500/0a0800/F97316?text=GTA+V',
    'Acción',
    false,
    true,
    NULL
  )
ON CONFLICT (slug) DO NOTHING;
