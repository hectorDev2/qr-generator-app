'use client';

import QRGenerator from '@/components/QRGenerator';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Generador de Códigos QR
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Crea códigos QR personalizados para tu negocio de forma gratuita
          </p>
        </div>
        <QRGenerator />
      </main>
      <footer className="text-center py-6 text-gray-600 dark:text-gray-400">
        <p>Herramienta gratuita para generar códigos QR personalizados</p>
      </footer>
    </div>
  );
}
