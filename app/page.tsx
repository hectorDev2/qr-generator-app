import QRGenerator from '@/components/QRGenerator';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex flex-col">

      {/* ── Header ── */}
      <header className="shrink-0 w-full border-b border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm z-20">
        <div className="container mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-blue-600 dark:text-blue-400 tracking-tight">QR</span>
            <span className="text-lg font-black text-gray-800 dark:text-white tracking-tight">Studio</span>
            <span className="ml-2 text-xs font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full">
              Gratis
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Badges compactos — ocultos en móvil */}
            <div className="hidden lg:flex flex-wrap gap-1.5">
              {FEATURES.map((f) => (
                <span
                  key={f}
                  className="text-xs font-medium bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded-full shadow-sm"
                >
                  {f}
                </span>
              ))}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Main: ocupa el espacio restante, sin scroll en el contenedor externo ── */}
      <main className="flex-1 overflow-hidden container mx-auto px-4 py-3 flex flex-col">

        {/* Título compacto */}
        <div className="text-center mb-3 shrink-0">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Generador de Códigos QR
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Personaliza estilo, color y logo · PNG o SVG · Sin registro
          </p>
        </div>

        {/* El generador ocupa el resto de la altura */}
        <div className="flex-1 overflow-hidden min-h-0">
          <QRGenerator />
        </div>
      </main>

      {/* ── Footer compacto ── */}
      <footer className="shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-1 text-xs text-gray-400 dark:text-gray-500">
          <span>
            <span className="font-semibold text-gray-600 dark:text-gray-300">QR Studio</span>
            {' '}— Herramienta gratuita para crear códigos QR personalizados
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            100% en tu navegador · Sin servidores · Privado
          </span>
        </div>
      </footer>
    </div>
  );
}

const FEATURES = [
  '🎨 Colores personalizados',
  '🖼️ Logo en el centro',
  '◼ 3 estilos de módulos',
  '⬇ PNG + SVG vectorial',
  '📐 Hasta 1200px',
  '💾 Guarda tu config',
  '🌙 Modo oscuro',
];
