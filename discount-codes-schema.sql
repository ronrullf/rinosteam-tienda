-- =============================================
-- Tabla: discount_codes (versión final)
-- Ejecutar en Supabase → SQL Editor
-- =============================================

-- 1. Limpiar versiones anteriores
DROP TABLE IF EXISTS "public.discount_codes" CASCADE;
DROP TABLE IF EXISTS discount_codes CASCADE;

-- 2. Crear la tabla
CREATE TABLE discount_codes (
  id            UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  code          TEXT         UNIQUE NOT NULL,
  discount_pct  INTEGER      NOT NULL CHECK (discount_pct BETWEEN 1 AND 100),
  duration_days INTEGER      NOT NULL,
  expires_at    TIMESTAMPTZ  NOT NULL,
  status        TEXT         NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'expired')),
  created_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- 3. Habilitar RLS
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- 4. Política única: acceso total (la protección está en la página admin con auth)
CREATE POLICY "full_access"
  ON discount_codes FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Recargar cache de PostgREST
NOTIFY pgrst, 'reload schema';
