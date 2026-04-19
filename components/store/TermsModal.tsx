'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '@/context/StoreContext'

export function TermsModal() {
  const { isTermsOpen, setTermsOpen } = useStore()

  return (
    <AnimatePresence>
      {isTermsOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60]"
            style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTermsOpen(false)}
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              className="w-full max-w-lg rounded-2xl border overflow-hidden"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'tween', duration: 0.2 }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4 border-b"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}
              >
                <h2 className="font-heading text-xl" style={{ color: 'var(--orange-400)' }}>
                  📄 Términos y Condiciones
                </h2>
                <button
                  onClick={() => setTermsOpen(false)}
                  className="text-2xl leading-none"
                  style={{ color: 'var(--text-muted)' }}
                >✕</button>
              </div>

              {/* Content */}
              <div
                className="overflow-y-auto p-5 flex flex-col gap-4 font-sans text-[14px]"
                style={{ maxHeight: '65vh', color: 'var(--text-secondary)' }}
              >
                <div>
                  <p className="font-heading text-base mb-2" style={{ color: 'var(--orange-400)' }}>
                    🧾 Instrucciones de uso
                  </p>
                  <ol className="flex flex-col gap-1.5 list-decimal list-inside">
                    <li>Ir a Steam → Parámetros (Settings) y desactivar: Remote Play y Steam Cloud (Nube)</li>
                    <li>Instalar el juego desde Steam</li>
                    <li>Abrir el juego por primera vez hasta el menú principal y luego salir</li>
                    <li className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      ⚠️ Solo se entra en modo conectado UNA vez
                    </li>
                    <li>Ir a Steam → Pasar a <strong>modo desconectado</strong></li>
                    <li>Borrar el acceso directo del juego del inicio</li>
                    <li>Siempre abrir desde Steam en modo desconectado</li>
                  </ol>
                </div>

                <div
                  className="rounded-xl p-3 border"
                  style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
                >
                  <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>⚠️ Importante</p>
                  <p>A veces Steam vuelve a modo conectado al cambiar cuenta o reiniciar la PC. Debes asegurarte de volver a modo desconectado para evitar perder progreso.</p>
                  <p className="mt-1">Si cambias de usuario: <strong>NO cerrar sesión</strong> — usar &ldquo;Cambiar de cuenta&rdquo;</p>
                </div>

                <div>
                  <p className="font-heading text-base mb-2" style={{ color: 'var(--orange-400)' }}>
                    📌 Reglas
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {[
                      'Solo puedes usarlo en 1 PC, no se puede transferir',
                      'No puedes jugar online',
                      'No manipular la información de la cuenta',
                      'Si cambian la contraseña, puedes solicitarla nuevamente',
                      'Garantía de 3 meses',
                      'No se responsabilizan por cambios en normativas de Steam',
                      'Prohibido usar grupo familiar',
                      'Solo se permite 1 formateo (si formateas otra vez, pierdes el juego)',
                    ].map((r) => (
                      <li key={r} className="flex gap-2">
                        <span style={{ color: 'var(--orange-500)' }}>›</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className="rounded-xl p-3 border"
                  style={{ backgroundColor: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.3)' }}
                >
                  <p className="font-semibold mb-1" style={{ color: '#EF4444' }}>
                    Si no cumples las reglas:
                  </p>
                  <ul className="flex flex-col gap-1">
                    {['Pierdes el juego', 'Pierdes la garantía', 'Sin derecho a reembolso'].map((r) => (
                      <li key={r} className="flex gap-2">
                        <span>❌</span><span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="px-5 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <button
                  onClick={() => setTermsOpen(false)}
                  className="w-full font-heading text-base py-2.5 rounded-xl transition-all"
                  style={{
                    backgroundColor: 'var(--orange-500)',
                    color: '#fff',
                  }}
                >
                  ENTENDIDO ✓
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
