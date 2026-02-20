import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Generador de Códigos QR Gratuito | Personaliza con Logo y Colores",
  description: "Crea códigos QR personalizados para tu negocio gratis. Agrega tu logo, personaliza colores y estilos. Descarga en alta calidad. 100% gratuito y sin registro.",
  keywords: ["generador qr", "codigo qr gratis", "qr personalizado", "qr con logo", "crear qr", "qr code generator"],
  authors: [{ name: "QR Generator" }],
  openGraph: {
    title: "Generador de Códigos QR Gratuito",
    description: "Crea códigos QR personalizados con logo y colores para tu negocio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Script inline para aplicar el tema ANTES del primer render y evitar flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  try{
    var t=localStorage.getItem('theme');
    if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){
      document.documentElement.classList.add('dark');
    }
  }catch(e){}
})();
`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
