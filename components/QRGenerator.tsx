'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';

type QRStyle = 'squares' | 'dots' | 'rounded';

interface QROptions {
  url: string;
  foregroundColor: string;
  backgroundColor: string;
  style: QRStyle;
  logo: string | null;
  logoSize: number;       // % del tamaño del QR (10–35)
  logoRadius: number;     // radio de borde redondeado del logo (0–20)
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
}

// Dibuja un rectángulo con esquinas redondeadas
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

export default function QRGenerator() {
  const [options, setOptions] = useState<QROptions>({
    url: 'https://tu-negocio.com',
    foregroundColor: '#1d4ed8',
    backgroundColor: '#ffffff',
    style: 'squares',
    logo: null,
    logoSize: 22,
    logoRadius: 10,
    errorCorrectionLevel: 'H',
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateQRCode = useCallback(async () => {
    if (!canvasRef.current || !options.url.trim()) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Obtener la matriz cruda de módulos del QR
      const qrData = await QRCode.create(options.url, {
        errorCorrectionLevel: options.errorCorrectionLevel,
      });

      const matrix = qrData.modules;
      const moduleCount = matrix.size;           // ej. 29 para versión 3
      const canvasSize = 400;
      const margin = 2;                           // módulos de margen (quietzone)
      const totalModules = moduleCount + margin * 2;
      const moduleSize = canvasSize / totalModules;

      canvas.width = canvasSize;
      canvas.height = canvasSize;

      // 1. Fondo
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      // 2. Dibujar cada módulo del QR
      ctx.fillStyle = options.foregroundColor;

      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (!matrix.get(row, col)) continue; // módulo vacío → no dibujar

          const x = (col + margin) * moduleSize;
          const y = (row + margin) * moduleSize;

          switch (options.style) {
            case 'dots': {
              // Círculo centrado en el módulo
              const cx = x + moduleSize / 2;
              const cy = y + moduleSize / 2;
              const r = moduleSize * 0.42;
              ctx.beginPath();
              ctx.arc(cx, cy, r, 0, Math.PI * 2);
              ctx.fill();
              break;
            }
            case 'rounded': {
              // Cuadrado con esquinas muy redondeadas
              roundRect(ctx, x + 0.5, y + 0.5, moduleSize - 1, moduleSize - 1, moduleSize * 0.35);
              ctx.fill();
              break;
            }
            default: {
              // Cuadrado clásico
              ctx.fillRect(x, y, moduleSize, moduleSize);
              break;
            }
          }
        }
      }

      // 3. Logo centrado (si existe)
      if (options.logo) {
        const img = new Image();
        img.onload = () => {
          const logoPx = canvasSize * (options.logoSize / 100);
          const lx = (canvasSize - logoPx) / 2;
          const ly = (canvasSize - logoPx) / 2;
          const padding = logoPx * 0.12;
          const totalPad = logoPx + padding * 2;
          const bx = lx - padding;
          const by = ly - padding;
          const borderRadius = options.logoRadius;

          // Fondo blanco redondeado detrás del logo
          ctx.fillStyle = options.backgroundColor;
          roundRect(ctx, bx, by, totalPad, totalPad, borderRadius);
          ctx.fill();

          // Sombra suave
          ctx.save();
          ctx.shadowColor = 'rgba(0,0,0,0.15)';
          ctx.shadowBlur = 8;
          roundRect(ctx, bx, by, totalPad, totalPad, borderRadius);
          ctx.fill();
          ctx.restore();

          // Dibujar logo con clip redondeado
          ctx.save();
          roundRect(ctx, lx, ly, logoPx, logoPx, borderRadius * 0.7);
          ctx.clip();
          ctx.drawImage(img, lx, ly, logoPx, logoPx);
          ctx.restore();
        };
        img.src = options.logo;
      }
    } catch (err) {
      console.error('Error generando QR:', err);
    }
  }, [options]);

  useEffect(() => {
    generateQRCode();
  }, [generateQRCode]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setOptions((prev) => ({ ...prev, logo: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setOptions((prev) => ({ ...prev, logo: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'codigo-qr.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const set = (key: keyof QROptions) => (val: QROptions[keyof QROptions]) =>
    setOptions((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="grid md:grid-cols-2">

        {/* ── Panel de Configuración ── */}
        <div className="p-8 space-y-6 overflow-y-auto max-h-[85vh]">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Personalización</h2>

          {/* URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              URL o Texto
            </label>
            <input
              type="text"
              value={options.url}
              onChange={(e) => set('url')(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
              placeholder="https://tu-negocio.com"
            />
          </div>

          {/* Colores */}
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Colores</p>
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                label="Color del QR"
                value={options.foregroundColor}
                onChange={(v) => set('foregroundColor')(v)}
              />
              <ColorPicker
                label="Color de Fondo"
                value={options.backgroundColor}
                onChange={(v) => set('backgroundColor')(v)}
              />
            </div>

            {/* Paleta de colores sugeridos */}
            <div className="mt-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Colores sugeridos para el QR</p>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    title={color}
                    onClick={() => set('foregroundColor')(color)}
                    style={{ backgroundColor: color }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                      options.foregroundColor === color
                        ? 'border-blue-500 scale-110'
                        : 'border-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Estilo */}
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Estilo del QR</p>
            <div className="grid grid-cols-3 gap-2">
              {STYLES.map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => set('style')(value)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 font-medium text-sm transition-all ${
                    options.style === value
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:text-gray-400'
                  }`}
                >
                  <span className="text-2xl">{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Logo */}
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Logo (opcional)</p>

            {!options.logo ? (
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                <span className="text-3xl mb-1">🖼️</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Click para subir tu logo
                </span>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG, SVG</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-4">
                {/* Preview del logo */}
                <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={options.logo}
                    alt="Logo"
                    className="w-14 h-14 object-contain rounded-lg border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Logo cargado</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Ajusta el tamaño y borde abajo</p>
                  </div>
                  <button
                    onClick={handleRemoveLogo}
                    className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Eliminar logo"
                  >
                    ✕
                  </button>
                </div>

                {/* Tamaño del logo */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Tamaño del logo
                    </label>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {options.logoSize}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={12}
                    max={35}
                    value={options.logoSize}
                    onChange={(e) => set('logoSize')(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                    <span>Pequeño</span>
                    <span>Grande</span>
                  </div>
                </div>

                {/* Radio del borde */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Borde redondeado
                    </label>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {options.logoRadius}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={options.logoRadius}
                    onChange={(e) => set('logoRadius')(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                    <span>Cuadrado</span>
                    <span>Circular</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Corrección de errores */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Calidad / Corrección de errores
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {ERROR_LEVELS.map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => set('errorCorrectionLevel')(value)}
                  title={desc}
                  className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                    options.errorCorrectionLevel === value
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Con logo, se recomienda usar <strong>H (Alto)</strong>
            </p>
          </div>

          {/* Botón descargar */}
          <button
            onClick={handleDownload}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/30 flex items-center justify-center gap-2"
          >
            <span>⬇</span> Descargar QR Code (PNG)
          </button>
        </div>

        {/* ── Panel de Vista Previa ── */}
        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-10">
          <div
            className="rounded-2xl shadow-2xl overflow-hidden"
            style={{ background: options.backgroundColor }}
          >
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="block"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
          <p className="mt-5 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
            Vista previa en tiempo real
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Sub-componente: ColorPicker ──────────────────────────────────────────────
function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-2 p-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-9 h-9 rounded cursor-pointer border-0 bg-transparent p-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 text-sm font-mono bg-transparent text-gray-800 dark:text-white focus:outline-none"
          maxLength={7}
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

// ── Constantes ────────────────────────────────────────────────────────────────
const PRESET_COLORS = [
  '#000000', '#1d4ed8', '#0369a1', '#065f46',
  '#7c3aed', '#be185d', '#b45309', '#dc2626',
  '#374151', '#1e3a5f', '#166534', '#4a1d96',
];

const STYLES: { value: QRStyle; label: string; icon: string }[] = [
  { value: 'squares', label: 'Clásico',    icon: '▦' },
  { value: 'rounded', label: 'Redondeado', icon: '⬛' },
  { value: 'dots',    label: 'Puntos',     icon: '⠿' },
];

const ERROR_LEVELS: { value: 'L' | 'M' | 'Q' | 'H'; label: string; desc: string }[] = [
  { value: 'L', label: 'L – 7%',  desc: 'Bajo - QR más simple' },
  { value: 'M', label: 'M – 15%', desc: 'Medio - recomendado sin logo' },
  { value: 'Q', label: 'Q – 25%', desc: 'Alto' },
  { value: 'H', label: 'H – 30%', desc: 'Máximo - recomendado con logo' },
];
