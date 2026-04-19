-- =============================================
-- Tabla: discount_codes
-- Ejecutar en Supabase → SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS discount_codes (
  id           UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  code         TEXT         UNIQUE NOT NULL,
  discount_pct INTEGER      NOT NULL CHECK (discount_pct BETWEEN 1 AND 100),
  duration_days INTEGER     NOT NULL,
  expires_at   TIMESTAMPTZ  NOT NULL,
  is_active    BOOLEAN      DEFAULT true,
  created_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Cualquier visitante puede leer (para validar códigos desde el cliente)
CREATE POLICY "public_read_discount_codes"
  ON discount_codes FOR SELECT
  USING (true);

-- Solo admin autenticado puede crear/editar/borrar
CREATE POLICY "auth_manage_discount_codes"
  ON discount_codes FOR ALL
  USING (auth.role() = 'authenticated');
