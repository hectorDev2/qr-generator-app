'use client';

import { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';

type QRStyle = 'squares' | 'dots' | 'rounded';

interface QROptions {
  url: string;
  foregroundColor: string;
  backgroundColor: string;
  style: QRStyle;
  logo: string | null;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
}

export default function QRGenerator() {
  const [options, setOptions] = useState<QROptions>({
    url: 'https://tu-negocio.com',
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    style: 'squares',
    logo: null,
    errorCorrectionLevel: 'M',
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generar QR code cuando cambien las opciones
  useEffect(() => {
    generateQRCode();
  }, [options]);

  const generateQRCode = async () => {
    if (!canvasRef.current || !options.url) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Configurar opciones de QRCode
      const qrOptions = {
        errorCorrectionLevel: options.errorCorrectionLevel,
        margin: 2,
        width: 400,
        color: {
          dark: options.foregroundColor,
          light: options.backgroundColor,
        },
      };

      // Generar QR en el canvas
      await QRCode.toCanvas(canvas, options.url, qrOptions);

      // Si hay logo, agregarlo al centro
      if (options.logo) {
        const img = new Image();
        img.onload = () => {
          const logoSize = canvas.width * 0.2; // Logo al 20% del tamaño
          const x = (canvas.width - logoSize) / 2;
          const y = (canvas.height - logoSize) / 2;

          // Dibujar fondo blanco para el logo
          ctx.fillStyle = options.backgroundColor;
          ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10);

          // Dibujar el logo
          ctx.drawImage(img, x, y, logoSize, logoSize);
        };
        img.src = options.logo;
      }

      // Aplicar estilo al QR
      if (options.style !== 'squares') {
        applyQRStyle(ctx, canvas.width, canvas.height);
      }
    } catch (error) {
      console.error('Error generando QR:', error);
    }
  };

  const applyQRStyle = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (options.style === 'dots') {
      // Aplicar estilo de puntos redondeados
      const imageData = ctx.getImageData(0, 0, width, height);
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      tempCtx.fillStyle = options.backgroundColor;
      tempCtx.fillRect(0, 0, width, height);
      tempCtx.fillStyle = options.foregroundColor;

      // Detectar y dibujar puntos en lugar de cuadrados
      const pixelSize = Math.ceil(width / 50); // Ajusta según el tamaño del módulo QR
      for (let y = 0; y < height; y += pixelSize) {
        for (let x = 0; x < width; x += pixelSize) {
          const i = (y * width + x) * 4;
          if (imageData.data[i] < 128) { // Píxel oscuro
            tempCtx.beginPath();
            tempCtx.arc(x + pixelSize / 2, y + pixelSize / 2, pixelSize / 2.5, 0, Math.PI * 2);
            tempCtx.fill();
          }
        }
      }
      ctx.drawImage(tempCanvas, 0, 0);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOptions({ ...options, logo: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = 'codigo-qr.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleRemoveLogo = () => {
    setOptions({ ...options, logo: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Panel de Configuración */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL o Texto
            </label>
            <input
              type="text"
              value={options.url}
              onChange={(e) => setOptions({ ...options, url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="https://tu-negocio.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color Principal
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={options.foregroundColor}
                  onChange={(e) => setOptions({ ...options, foregroundColor: e.target.value })}
                  className="w-12 h-12 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={options.foregroundColor}
                  onChange={(e) => setOptions({ ...options, foregroundColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color de Fondo
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={options.backgroundColor}
                  onChange={(e) => setOptions({ ...options, backgroundColor: e.target.value })}
                  className="w-12 h-12 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={options.backgroundColor}
                  onChange={(e) => setOptions({ ...options, backgroundColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estilo del QR
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['squares', 'dots', 'rounded'] as QRStyle[]).map((style) => (
                <button
                  key={style}
                  onClick={() => setOptions({ ...options, style })}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    options.style === style
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {style === 'squares' ? 'Cuadrados' : style === 'dots' ? 'Puntos' : 'Redondeado'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nivel de Corrección de Errores
            </label>
            <select
              value={options.errorCorrectionLevel}
              onChange={(e) => setOptions({ ...options, errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="L">Bajo (7%)</option>
              <option value="M">Medio (15%)</option>
              <option value="Q">Alto (25%)</option>
              <option value="H">Muy Alto (30%)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Logo (opcional)
            </label>
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {options.logo && (
                <button
                  onClick={handleRemoveLogo}
                  className="text-sm text-red-600 hover:text-red-800 dark:text-red-400"
                >
                  Eliminar logo
                </button>
              )}
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg"
          >
            Descargar QR Code
          </button>
        </div>

        {/* Panel de Vista Previa */}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto"
              width={400}
              height={400}
            />
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Vista previa en tiempo real
          </p>
        </div>
      </div>
    </div>
  );
}
