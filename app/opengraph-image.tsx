import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'RinoSteam — Juegos Steam hasta 90% más baratos'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#080402',
          fontFamily: 'sans-serif',
          gap: 24,
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            height: 200,
            background: 'rgba(249,115,22,0.15)',
            filter: 'blur(80px)',
            borderRadius: '50%',
          }}
        />

        {/* Badge */}
        <div
          style={{
            backgroundColor: '#F97316',
            color: '#fff',
            padding: '8px 20px',
            borderRadius: 999,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          🔥 HASTA 90% MÁS BARATO
        </div>

        {/* Logo */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: 4,
          }}
        >
          🦏 RINO<span style={{ color: '#F97316' }}>STEAM</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 36,
            color: '#C9A882',
            textAlign: 'center',
          }}
        >
          Jugar primero, pagar después
        </div>
      </div>
    ),
    { ...size }
  )
}
