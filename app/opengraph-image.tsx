import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'QR Studio — Generador de Códigos QR Gratuito';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  // Grid de cuadrados que simulan un QR (7x7 pattern)
  const qrPattern = [
    [1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1],
    [1,0,1,0,1,0,1],
    [1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1],
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e1b4b 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow background */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Left content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '80px 60px',
            gap: '24px',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(59,130,246,0.2)',
              border: '1px solid rgba(59,130,246,0.4)',
              borderRadius: '100px',
              padding: '8px 20px',
              width: 'fit-content',
              color: '#93c5fd',
              fontSize: '18px',
              fontWeight: '600',
            }}
          >
            100% Gratis
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div
              style={{
                fontSize: '80px',
                fontWeight: '900',
                color: '#ffffff',
                lineHeight: '1',
                letterSpacing: '-2px',
              }}
            >
              QR Studio
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: '400',
                color: '#94a3b8',
                lineHeight: '1.4',
              }}
            >
              Generador de QR gratuito
            </div>
          </div>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginTop: '8px',
            }}
          >
            {['Con logo personalizado', 'Sin registro', 'PNG + SVG vectorial'].map((feat) => (
              <div
                key={feat}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#cbd5e1',
                  fontSize: '22px',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#3b82f6',
                    flexShrink: 0,
                  }}
                />
                {feat}
              </div>
            ))}
          </div>
        </div>

        {/* Right: QR visual */}
        <div
          style={{
            width: '380px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 60px 60px 20px',
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '24px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0px',
            }}
          >
            {qrPattern.map((row, ri) => (
              <div key={ri} style={{ display: 'flex', gap: '0px' }}>
                {row.map((cell, ci) => (
                  <div
                    key={ci}
                    style={{
                      width: '32px',
                      height: '32px',
                      background: cell ? '#3b82f6' : 'transparent',
                      borderRadius: '4px',
                      margin: '2px',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
