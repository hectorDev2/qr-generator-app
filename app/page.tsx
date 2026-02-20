import QRGenerator from '@/components/QRGenerator';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex flex-col">

      {/* ── Header ── */}
      <header className="w-full border-b border-white/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-blue-600 dark:text-blue-400 tracking-tight">QR</span>
            <span className="text-xl font-black text-gray-800 dark:text-white tracking-tight">Studio</span>
            <span className="ml-2 text-xs font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full">
              Gratis
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* ── Hero ── */}
      <main className="container mx-auto px-4 py-10 flex-1">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
            Generador de Códigos QR
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Personaliza el estilo, color y logo. Descarga en PNG o SVG vectorial. Sin registro, sin límites.
          </p>

          {/* Badges de características */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {FEATURES.map((f) => (
              <span
                key={f}
                className="text-xs font-medium bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-full shadow-sm"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <QRGenerator />
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm mt-8">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400 dark:text-gray-500">
          <span>
            <span className="font-semibold text-gray-600 dark:text-gray-300">QR Studio</span>
            {' '}— Herramienta gratuita para crear códigos QR personalizados
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              100% en tu navegador · Sin servidores · Privado
            </span>
          </div>
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
