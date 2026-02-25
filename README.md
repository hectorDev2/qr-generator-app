# QR Studio — Generador de Códigos QR Personalizado

Una aplicación web moderna, gratuita y completamente responsiva para generar códigos QR personalizados con logo, gradientes, texturas y estilos. Todo se procesa en el navegador — sin servidores, sin registro.

**Demo en vivo:** [https://qr-generator-app-rho.vercel.app](https://qr-generator-app-rho.vercel.app)

## Características

### Relleno del QR
- **Modo Sólido** — Selector de color, input hex y paleta de 12 colores sugeridos
- **Modo Degradado** — 6 presets (Océano, Fuego, Bosque, Gris, Atardecer, Neón) + personalizado, con 4 direcciones: horizontal, vertical, diagonal y radial
- **Modo Imagen** — Sube cualquier foto o textura y se recorta en la forma de los módulos del QR

### Personalización
- **3 estilos de módulos** — Cuadrados clásicos, redondeados o puntos/círculos
- **Logo personalizado** — Agrega el logo de tu negocio en el centro del QR con tamaño y borde ajustables
- **Drag & drop** — Arrastra logo o textura directamente al área de carga
- **Color de fondo** — Independiente del modo de relleno de módulos

### Exportación
- **PNG** en 400, 800 o 1200px — con gradiente o textura preservados
- **SVG vectorial** — incluye `<linearGradient>` / `<radialGradient>` para modo degradado; escala sin perder calidad
- **Copiar al portapapeles** — Copia el QR como imagen PNG con un clic (Chrome/Safari, HTTPS)

### UX y productividad
- **URL compartible** — Cada configuración genera una URL única (`?q=...&fill=gradient&gp=fire&style=dots`) para compartir la config exacta
- **Vista previa en tiempo real** — Canvas actualizado con debounce de 500ms
- **Persistencia local** — La configuración se guarda en `localStorage` y se restaura al recargar
- **Modo oscuro sin parpadeo** — Tema aplicado antes del primer render
- **Diseño responsivo** — Mobile, tablet y desktop

### SEO y comunidad
- **Open Graph** — Preview visual al compartir en Twitter, LinkedIn, WhatsApp y Slack
- **Sitemap y robots.txt** — Generados automáticamente por Next.js
- **MIT License** — Libre para uso personal, comercial y contribuciones
- **Analytics de privacidad** — Vercel Analytics anónimo, sin cookies

## Tecnologías

- **Next.js 16** con App Router
- **React 19** + **TypeScript 5**
- **Tailwind CSS v4**
- **Canvas API** — renderizado manual con gradientes, offscreen source-in para texturas
- **qrcode** — generación de la matriz de datos QR
- **next/og** (ImageResponse) — OG image dinámica en Edge Runtime

## Instalación local

```bash
git clone https://github.com/hectorDev2/qr-generator-app.git
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
2. **Elige el modo de relleno** — Sólido, Degradado o Imagen (tab en la sección Colores)
3. **Personaliza** — colores, preset de gradiente, dirección o textura propia
4. **Elige un estilo** — Clásico, Redondeado o Puntos
5. **Sube tu logo** (opcional) y ajusta tamaño y borde con los sliders
6. **Selecciona el nivel de corrección de errores** (usa H si tienes logo)
7. **Descarga** en PNG (400 / 800 / 1200px) o SVG vectorial
8. **Comparte** — copia la URL de configuración con el botón 🔗

## URL compartible — parámetros

| Param | Valores | Descripción |
|-------|---------|-------------|
| `q` | texto | URL o contenido del QR |
| `fg` | hex sin `#` | Color de módulos (modo sólido) |
| `bg` | hex sin `#` | Color de fondo |
| `style` | `squares` `dots` `rounded` | Estilo de módulos |
| `ecl` | `L` `M` `Q` `H` | Nivel de corrección de errores |
| `fill` | `solid` `gradient` `image` | Modo de relleno |
| `gp` | `ocean` `fire` `forest` `gray` `sunset` `neon` `custom` | Preset de gradiente |
| `gc1` | hex sin `#` | Color 1 del gradiente |
| `gc2` | hex sin `#` | Color 2 del gradiente |
| `gd` | `horizontal` `vertical` `diagonal` `radial` | Dirección del gradiente |

Ejemplo: `?q=https://misitio.com&fill=gradient&gp=fire&style=dots`

## Niveles de corrección de errores

| Nivel | Recuperación | Uso recomendado |
|-------|-------------|-----------------|
| L | 7% | Sin logo, QR simple |
| M | 15% | Uso general |
| Q | 25% | Con logo pequeño |
| H | 30% | Con logo — recomendado |

## Consejos

- Usa un logo con fondo transparente (PNG)
- Para texturas, imágenes de alto contraste dan mejores resultados
- El modo degradado se exporta correctamente en SVG vectorial
- El modo imagen solo está disponible en PNG
- Asegura buen contraste entre el relleno del QR y el fondo
- Prueba siempre el QR con la cámara antes de imprimirlo
- Para impresión física, usa SVG o PNG 1200px

## Licencia

[MIT](./LICENSE) — libre para uso personal, comercial y modificaciones.

---

Hecho con ❤️ para la comunidad
