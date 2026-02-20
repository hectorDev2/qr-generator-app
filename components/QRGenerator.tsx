'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';

// ── Tipos ────────────────────────────────────────────────────────────────────
type QRStyle = 'squares' | 'dots' | 'rounded';
type DownloadSize = 400 | 800 | 1200;
type DownloadFormat = 'png' | 'svg';

interface QROptions {
  url: string;
  foregroundColor: string;
  backgroundColor: string;
  style: QRStyle;
  logo: string | null;
  logoSize: number;
  logoRadius: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
}

const STORAGE_KEY = 'qr-generator-options';

const DEFAULT_OPTIONS: QROptions = {
  url: 'https://tu-negocio.com',
  foregroundColor: '#1d4ed8',
  backgroundColor: '#ffffff',
  style: 'squares',
  logo: null,
  logoSize: 22,
  logoRadius: 10,
  errorCorrectionLevel: 'H',
};

// ── Helpers canvas ───────────────────────────────────────────────────────────
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
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

function isValidUrl(value: string): boolean {
  if (!value.trim()) return false;
  try {
    new URL(value);
    return true;
  } catch {
    // También permitir texto plano no-URL (ej: "Mi negocio")
    return value.trim().length >= 1;
  }
}

// ── Hook de persistencia ─────────────────────────────────────────────────────
function usePersistedOptions() {
  const [options, setOptionsState] = useState<QROptions>(() => {
    if (typeof window === 'undefined') return DEFAULT_OPTIONS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<QROptions>;
        return { ...DEFAULT_OPTIONS, ...parsed };
      }
    } catch { /* noop */ }
    return DEFAULT_OPTIONS;
  });

  const setOptions = useCallback((updater: QROptions | ((prev: QROptions) => QROptions)) => {
    setOptionsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        // No persistir el logo (puede ser muy grande para localStorage)
        const { logo: _logo, ...toSave } = next;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } catch { /* noop */ }
      return next;
    });
  }, []);

  return [options, setOptions] as const;
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function QRGenerator() {
  const [options, setOptions] = usePersistedOptions();
  const [urlInput, setUrlInput] = useState(options.url);  // input controlado (para debounce)
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'done'>('idle');
  const [downloadSize, setDownloadSize] = useState<DownloadSize>(800);
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>('png');
  const [isDragging, setIsDragging] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoLoadRef = useRef<number>(0); // incrementa con cada render para cancelar cargas viejas

  // ── Debounce en el campo URL ─────────────────────────────────────────────
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrlInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!val.trim()) {
        setUrlError('Ingresa una URL o texto');
        return;
      }
      setUrlError(null);
      setOptions((prev) => ({ ...prev, url: val }));
    }, 500);
  };

  // ── Generación del QR en canvas ──────────────────────────────────────────
  const generateQRCode = useCallback(async () => {
    if (!canvasRef.current || !options.url.trim()) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsGenerating(true);
    const thisLoad = ++logoLoadRef.current; // "token" de esta generación

    try {
      const qrData = await QRCode.create(options.url, {
        errorCorrectionLevel: options.errorCorrectionLevel,
      });

      const matrix = qrData.modules;
      const moduleCount = matrix.size;
      const canvasSize = 400;
      const margin = 2;
      const totalModules = moduleCount + margin * 2;
      const moduleSize = canvasSize / totalModules;

      canvas.width = canvasSize;
      canvas.height = canvasSize;

      // 1. Fondo
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      // 2. Módulos QR
      ctx.fillStyle = options.foregroundColor;

      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (!matrix.get(row, col)) continue;
          const x = (col + margin) * moduleSize;
          const y = (row + margin) * moduleSize;

          switch (options.style) {
            case 'dots': {
              ctx.beginPath();
              ctx.arc(x + moduleSize / 2, y + moduleSize / 2, moduleSize * 0.42, 0, Math.PI * 2);
              ctx.fill();
              break;
            }
            case 'rounded': {
              roundRect(ctx, x + 0.5, y + 0.5, moduleSize - 1, moduleSize - 1, moduleSize * 0.35);
              ctx.fill();
              break;
            }
            default: {
              ctx.fillRect(x, y, moduleSize, moduleSize);
              break;
            }
          }
        }
      }

      // 3. Logo (si hay uno) — cancelamos si llegó una generación más nueva
      if (options.logo) {
        const img = new Image();
        img.onload = () => {
          if (thisLoad !== logoLoadRef.current) return; // descartamos si hay una carga más reciente
          const logoPx = canvasSize * (options.logoSize / 100);
          const lx = (canvasSize - logoPx) / 2;
          const ly = (canvasSize - logoPx) / 2;
          const padding = logoPx * 0.12;
          const totalPad = logoPx + padding * 2;
          const bx = lx - padding;
          const by = ly - padding;

          ctx.fillStyle = options.backgroundColor;
          roundRect(ctx, bx, by, totalPad, totalPad, options.logoRadius);
          ctx.fill();

          ctx.save();
          ctx.shadowColor = 'rgba(0,0,0,0.15)';
          ctx.shadowBlur = 8;
          roundRect(ctx, bx, by, totalPad, totalPad, options.logoRadius);
          ctx.fill();
          ctx.restore();

          ctx.save();
          roundRect(ctx, lx, ly, logoPx, logoPx, options.logoRadius * 0.7);
          ctx.clip();
          ctx.drawImage(img, lx, ly, logoPx, logoPx);
          ctx.restore();
        };
        img.onerror = () => { /* logo inválido, ignorar */ };
        img.src = options.logo;
      }
    } catch (err) {
      console.error('Error generando QR:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [options]);

  useEffect(() => {
    generateQRCode();
  }, [generateQRCode]);

  // Sincronizar urlInput si options.url cambia desde fuera (ej: localStorage)
  useEffect(() => {
    setUrlInput(options.url);
  }, []); // solo al montar

  // ── Descarga PNG a tamaño personalizado ─────────────────────────────────
  const downloadPNG = async (size: DownloadSize) => {
    if (!options.url.trim()) return;

    const offscreen = document.createElement('canvas');
    offscreen.width = size;
    offscreen.height = size;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return;

    const qrData = await QRCode.create(options.url, {
      errorCorrectionLevel: options.errorCorrectionLevel,
    });

    const matrix = qrData.modules;
    const moduleCount = matrix.size;
    const margin = 2;
    const totalModules = moduleCount + margin * 2;
    const moduleSize = size / totalModules;

    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = options.foregroundColor;

    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (!matrix.get(row, col)) continue;
        const x = (col + margin) * moduleSize;
        const y = (row + margin) * moduleSize;
        switch (options.style) {
          case 'dots':
            ctx.beginPath();
            ctx.arc(x + moduleSize / 2, y + moduleSize / 2, moduleSize * 0.42, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'rounded':
            roundRect(ctx, x + 0.5, y + 0.5, moduleSize - 1, moduleSize - 1, moduleSize * 0.35);
            ctx.fill();
            break;
          default:
            ctx.fillRect(x, y, moduleSize, moduleSize);
        }
      }
    }

    // Logo escalado
    if (options.logo) {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const logoPx = size * (options.logoSize / 100);
          const lx = (size - logoPx) / 2;
          const ly = (size - logoPx) / 2;
          const padding = logoPx * 0.12;
          const totalPad = logoPx + padding * 2;

          ctx.fillStyle = options.backgroundColor;
          roundRect(ctx, lx - padding, ly - padding, totalPad, totalPad, options.logoRadius);
          ctx.fill();

          ctx.save();
          roundRect(ctx, lx, ly, logoPx, logoPx, options.logoRadius * 0.7);
          ctx.clip();
          ctx.drawImage(img, lx, ly, logoPx, logoPx);
          ctx.restore();
          resolve();
        };
        img.onerror = () => resolve();
        img.src = options.logo!;
      });
    }

    const link = document.createElement('a');
    link.download = `codigo-qr-${size}px.png`;
    link.href = offscreen.toDataURL('image/png');
    link.click();
  };

  // ── Descarga SVG vectorial ───────────────────────────────────────────────
  const downloadSVG = async () => {
    if (!options.url.trim()) return;

    const qrData = await QRCode.create(options.url, {
      errorCorrectionLevel: options.errorCorrectionLevel,
    });

    const matrix = qrData.modules;
    const moduleCount = matrix.size;
    const margin = 2;
    const totalModules = moduleCount + margin * 2;
    const svgSize = 400;
    const moduleSize = svgSize / totalModules;

    let paths = '';

    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (!matrix.get(row, col)) continue;
        const x = (col + margin) * moduleSize;
        const y = (row + margin) * moduleSize;
        const m = moduleSize;
        const r = moduleSize * 0.35;

        switch (options.style) {
          case 'dots': {
            const cx = x + m / 2;
            const cy = y + m / 2;
            const radius = m * 0.42;
            paths += `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${radius.toFixed(2)}"/>`;
            break;
          }
          case 'rounded': {
            const rx = Math.min(r, m / 2);
            paths += `<rect x="${(x + 0.5).toFixed(2)}" y="${(y + 0.5).toFixed(2)}" width="${(m - 1).toFixed(2)}" height="${(m - 1).toFixed(2)}" rx="${rx.toFixed(2)}" ry="${rx.toFixed(2)}"/>`;
            break;
          }
          default:
            paths += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${m.toFixed(2)}" height="${m.toFixed(2)}"/>`;
        }
      }
    }

    // Logo como imagen embebida en SVG (base64)
    let logoElement = '';
    if (options.logo) {
      const logoPx = svgSize * (options.logoSize / 100);
      const lx = (svgSize - logoPx) / 2;
      const ly = (svgSize - logoPx) / 2;
      const padding = logoPx * 0.12;
      const totalPad = logoPx + padding * 2;
      const rx = options.logoRadius;

      logoElement = `
        <rect x="${(lx - padding).toFixed(2)}" y="${(ly - padding).toFixed(2)}"
          width="${totalPad.toFixed(2)}" height="${totalPad.toFixed(2)}"
          rx="${rx}" ry="${rx}" fill="${options.backgroundColor}"/>
        <clipPath id="logo-clip">
          <rect x="${lx.toFixed(2)}" y="${ly.toFixed(2)}"
            width="${logoPx.toFixed(2)}" height="${logoPx.toFixed(2)}"
            rx="${(rx * 0.7).toFixed(1)}" ry="${(rx * 0.7).toFixed(1)}"/>
        </clipPath>
        <image href="${options.logo}"
          x="${lx.toFixed(2)}" y="${ly.toFixed(2)}"
          width="${logoPx.toFixed(2)}" height="${logoPx.toFixed(2)}"
          clip-path="url(#logo-clip)" preserveAspectRatio="xMidYMid slice"/>`;
    }

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">
  <rect width="${svgSize}" height="${svgSize}" fill="${options.backgroundColor}"/>
  <g fill="${options.foregroundColor}">
    ${paths}
  </g>
  ${logoElement}
</svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'codigo-qr.svg';
    link.href = url;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // ── Descarga unificada ───────────────────────────────────────────────────
  const handleDownload = async () => {
    setDownloadStatus('downloading');
    try {
      if (downloadFormat === 'svg') {
        await downloadSVG();
      } else {
        await downloadPNG(downloadSize);
      }
      setDownloadStatus('done');
      setTimeout(() => setDownloadStatus('idle'), 2000);
    } catch {
      setDownloadStatus('idle');
    }
  };

  // ── Logo upload / remove ─────────────────────────────────────────────────
  const loadLogoFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setOptions((prev) => ({ ...prev, logo: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadLogoFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadLogoFile(file);
  };

  const handleRemoveLogo = () => {
    setOptions((prev) => ({ ...prev, logo: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    setOptions(DEFAULT_OPTIONS);
    setUrlInput(DEFAULT_OPTIONS.url);
    setUrlError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const set = (key: keyof QROptions) => (val: QROptions[keyof QROptions]) =>
    setOptions((prev) => ({ ...prev, [key]: val }));

  // ── UI ───────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="grid lg:grid-cols-2 lg:items-start">

        {/* ── Panel izquierdo: configuración ── */}
        <div className="p-5 space-y-4 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-700 lg:overflow-y-auto lg:max-h-[calc(100vh-7rem)]">

          {/* Encabezado con botón reset */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800 dark:text-white">Personalización</h2>
            <button
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center gap-1 transition-colors"
              title="Restablecer valores por defecto"
            >
              ↺ Restablecer
            </button>
          </div>

          {/* URL con validación */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              URL o Texto
            </label>
            <input
              type="text"
              value={urlInput}
              onChange={handleUrlChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm transition-colors ${
                urlError
                  ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="https://tu-negocio.com"
            />
            {urlError && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <span>⚠</span> {urlError}
              </p>
            )}
            {!urlError && urlInput !== options.url && (
              <p className="mt-1 text-xs text-gray-400 animate-pulse">Actualizando QR…</p>
            )}
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
            <div className="mt-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Colores sugeridos</p>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    title={color}
                    onClick={() => set('foregroundColor')(color)}
                    style={{ backgroundColor: color }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                      options.foregroundColor === color
                        ? 'border-blue-500 scale-110 shadow-md'
                        : 'border-white shadow-sm'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Estilos */}
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Estilo del QR</p>
            <div className="grid grid-cols-3 gap-2">
              {STYLES.map(({ value, label, preview }) => (
                <button
                  key={value}
                  onClick={() => set('style')(value)}
                  className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl border-2 font-medium text-xs transition-all ${
                    options.style === value
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:text-gray-400'
                  }`}
                >
                  <StylePreview type={value} color={options.foregroundColor} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Logo */}
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Logo (opcional)</p>
            {!options.logo ? (
              <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 scale-[1.01]'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
              >
                <span className="text-2xl mb-1">{isDragging ? '📂' : '🖼️'}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {isDragging ? 'Suelta la imagen aquí' : 'Arrastra o haz clic para subir'}
                </span>
                <span className="text-xs text-gray-400 mt-0.5">PNG · JPG · SVG</span>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={options.logo} alt="Logo" className="w-12 h-12 object-contain rounded-lg border border-gray-200 dark:border-gray-600 bg-white" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Logo cargado</p>
                    <p className="text-xs text-gray-400 mt-0.5">Ajusta tamaño y borde abajo</p>
                  </div>
                  <button
                    onClick={handleRemoveLogo}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Quitar logo"
                  >✕</button>
                </div>
                <Slider label="Tamaño" min={12} max={35} value={options.logoSize}
                  unit="%" leftLabel="Pequeño" rightLabel="Grande"
                  onChange={(v) => set('logoSize')(v)} />
                <Slider label="Borde redondeado" min={0} max={50} value={options.logoRadius}
                  unit="px" leftLabel="Cuadrado" rightLabel="Circular"
                  onChange={(v) => set('logoRadius')(v)} />
              </div>
            )}
          </div>

          {/* Corrección de errores */}
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Corrección de errores
            </p>
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
            <p className="text-xs text-gray-400 mt-1">Con logo, usar <strong>H</strong></p>
          </div>

          {/* Descarga */}
          <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Descargar</p>

            {/* Formato */}
            <div className="grid grid-cols-2 gap-2">
              {(['png', 'svg'] as DownloadFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setDownloadFormat(fmt)}
                  className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                    downloadFormat === fmt
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {fmt.toUpperCase()}
                  {fmt === 'svg' && <span className="ml-1 text-xs font-normal opacity-75">vectorial</span>}
                </button>
              ))}
            </div>

            {/* Tamaño (solo PNG) */}
            {downloadFormat === 'png' && (
              <div className="grid grid-cols-3 gap-2">
                {DOWNLOAD_SIZES.map(({ size, label }) => (
                  <button
                    key={size}
                    onClick={() => setDownloadSize(size)}
                    className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                      downloadSize === size
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {downloadFormat === 'svg' && (
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <span>ℹ</span> SVG es vectorial — escala sin perder calidad, ideal para impresión
              </p>
            )}

            {/* Botón */}
            <button
              onClick={handleDownload}
              disabled={downloadStatus === 'downloading' || !!urlError || !options.url.trim()}
              className={`w-full font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg ${
                downloadStatus === 'done'
                  ? 'bg-green-500 text-white shadow-green-200'
                  : downloadStatus === 'downloading'
                  ? 'bg-blue-400 text-white cursor-wait'
                  : urlError || !options.url.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-blue-200 dark:shadow-blue-900/30'
              }`}
            >
              {downloadStatus === 'downloading' && <span className="animate-spin">⟳</span>}
              {downloadStatus === 'done' && <span>✓</span>}
              {downloadStatus === 'idle' && <span>⬇</span>}
              {downloadStatus === 'done'
                ? '¡Descargado!'
                : downloadStatus === 'downloading'
                ? 'Generando…'
                : `Descargar ${downloadFormat.toUpperCase()}${downloadFormat === 'png' ? ` · ${downloadSize}px` : ''}`}
            </button>
          </div>
        </div>

        {/* ── Panel derecho: preview ── */}
        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 lg:sticky lg:top-14 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">

          {/* Canvas con indicador de carga */}
          <div className="relative">
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-black/40 rounded-2xl z-10">
                <span className="text-2xl animate-spin">⟳</span>
              </div>
            )}
            <div
              className="rounded-2xl shadow-2xl overflow-hidden transition-all"
              style={{ background: options.backgroundColor }}
            >
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="block w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[380px] xl:max-w-[400px] h-auto"
              />
            </div>
          </div>

          {/* Info de resolución */}
          <p className="mt-5 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
            Vista previa en tiempo real
          </p>

          {/* Info de persistencia */}
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
            <span>💾</span> Configuración guardada automáticamente
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Sub-componentes ──────────────────────────────────────────────────────────

function ColorPicker({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  const isValid = /^#[0-9A-Fa-f]{6}$/.test(value);
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">{label}</label>
      <div className={`flex items-center gap-2 p-1.5 border rounded-lg bg-white dark:bg-gray-700 transition-colors ${
        isValid ? 'border-gray-300 dark:border-gray-600' : 'border-red-400'
      }`}>
        <input
          type="color"
          value={isValid ? value : '#000000'}
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
      {!isValid && value.length > 0 && (
        <p className="text-xs text-red-500 mt-0.5">Color inválido</p>
      )}
    </div>
  );
}

function Slider({ label, min, max, value, unit, leftLabel, rightLabel, onChange }: {
  label: string; min: number; max: number; value: number;
  unit: string; leftLabel: string; rightLabel: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</label>
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
        <span>{leftLabel}</span><span>{rightLabel}</span>
      </div>
    </div>
  );
}

/** Mini-preview SVG del estilo de módulo */
function StylePreview({ type, color }: { type: QRStyle; color: string }) {
  const s = 32;
  const grid = [0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1];
  const cols = 4;
  const cell = s / cols;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden="true">
      {grid.map((on, i) => {
        if (!on) return null;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = col * cell;
        const y = row * cell;
        if (type === 'dots')
          return <circle key={i} cx={x + cell / 2} cy={y + cell / 2} r={cell * 0.4} fill={color} />;
        if (type === 'rounded')
          return <rect key={i} x={x + 0.5} y={y + 0.5} width={cell - 1} height={cell - 1} rx={cell * 0.3} fill={color} />;
        return <rect key={i} x={x} y={y} width={cell} height={cell} fill={color} />;
      })}
    </svg>
  );
}

// ── Constantes ────────────────────────────────────────────────────────────────
const PRESET_COLORS = [
  '#000000', '#1d4ed8', '#0369a1', '#065f46',
  '#7c3aed', '#be185d', '#b45309', '#dc2626',
  '#374151', '#0f172a', '#166534', '#4a1d96',
];

const STYLES: { value: QRStyle; label: string; preview: string }[] = [
  { value: 'squares', label: 'Clásico',    preview: '' },
  { value: 'rounded', label: 'Redondeado', preview: '' },
  { value: 'dots',    label: 'Puntos',     preview: '' },
];

const ERROR_LEVELS = [
  { value: 'L' as const, label: 'L · 7%',  desc: 'Bajo – sin logo' },
  { value: 'M' as const, label: 'M · 15%', desc: 'Medio' },
  { value: 'Q' as const, label: 'Q · 25%', desc: 'Alto' },
  { value: 'H' as const, label: 'H · 30%', desc: 'Máximo – con logo' },
];

const DOWNLOAD_SIZES: { size: DownloadSize; label: string }[] = [
  { size: 400,  label: '400px · Web' },
  { size: 800,  label: '800px · HD' },
  { size: 1200, label: '1200px · Print' },
];
