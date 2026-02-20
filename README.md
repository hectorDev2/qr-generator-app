# QR Studio — Generador de Códigos QR Personalizado

Una aplicación web moderna, gratuita y completamente responsiva para generar códigos QR personalizados con logo, colores y estilos. Todo se procesa en el navegador — sin servidores, sin registro.

**Demo en vivo:** [https://qr-generator-app-rho.vercel.app](https://qr-generator-app-rho.vercel.app)

## Características

- **Diseño responsivo** — Funciona en mobile, tablet y desktop. Una sola columna en mobile con scroll natural del navegador; dos columnas equilibradas en laptop/desktop
- **Drag & drop** — Arrastra tu logo directamente al área de carga o haz clic para seleccionarlo
- **Modo oscuro sin parpadeo** — Tema aplicado antes del primer render para evitar flash
- **Personalización completa de colores** — Selector de color, input hex y paleta de 12 colores sugeridos
- **Logo personalizado** — Agrega el logo de tu negocio en el centro del QR con tamaño y borde ajustables
- **3 estilos de módulos** — Cuadrados clásicos, redondeados o puntos/círculos
- **Vista previa en tiempo real** — Canvas actualizado con debounce de 500ms
- **Exportar en PNG y SVG** — PNG en 400, 800 o 1200px; SVG vectorial escalable con logo embebido
- **Validación de URL** — Detecta y valida el contenido automáticamente
- **Persistencia local** — La configuración se guarda en `localStorage` y se restaura al recargar
- **Privacidad** — 100% en el navegador, ningún dato sale de tu dispositivo

## Tecnologías

- **Next.js 16** con App Router
- **React 19** + **TypeScript 5**
- **Tailwind CSS v4**
- **Canvas API** — renderizado manual de módulos QR con estilos y colores precisos
- **qrcode** — generación de la matriz de datos QR

## Instalación local

```bash
git clone <tu-repo>
cd qr-generator-app
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Despliegue en Vercel

### Opción 1: desde GitHub

1. Sube el código a un repositorio de GitHub
2. Ve a [vercel.com](https://vercel.com) y crea una cuenta gratuita
3. Click en **New Project** e importa tu repositorio
4. Vercel detecta Next.js automáticamente — click en **Deploy**

### Opción 2: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

## Uso

1. **Ingresa tu URL o texto** en el campo superior
2. **Personaliza los colores** con el selector o ingresa un código hex
3. **Elige un estilo** — Clásico, Redondeado o Puntos
4. **Sube tu logo** (opcional) — arrastra la imagen o haz clic en el área de carga
5. **Ajusta tamaño y borde** del logo con los sliders
6. **Selecciona el nivel de corrección de errores** (usa H si tienes logo)
7. **Descarga** en PNG (400 / 800 / 1200px) o SVG vectorial

## Niveles de corrección de errores

| Nivel | Recuperación | Uso recomendado |
|-------|-------------|-----------------|
| L | 7% | Sin logo, QR simple |
| M | 15% | Uso general |
| Q | 25% | Con logo pequeño |
| H | 30% | Con logo — recomendado |

## Consejos

- Usa un logo con fondo transparente (PNG)
- Asegura buen contraste entre el color del QR y el fondo
- Prueba siempre el QR antes de imprimirlo
- Para impresión física, usa SVG o PNG 1200px

## Licencia

Código abierto y gratuito para uso personal y comercial.

---

Hecho con ❤️ para la comunidad
