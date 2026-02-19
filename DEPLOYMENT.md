# Guía de Despliegue - Generador de QR

## Resumen de lo Creado

He creado una aplicación web completa para generar códigos QR personalizados con las siguientes características:

### Características Implementadas ✅

1. **Generación de QR Personalizado**
   - Input para URL o texto personalizado
   - Generación en tiempo real

2. **Personalización de Colores**
   - Selector de color para el QR (color principal)
   - Selector de color para el fondo
   - Input manual de códigos hexadecimales

3. **Subida de Logo**
   - Upload de imagen para agregar logo al centro del QR
   - Vista previa del logo
   - Opción de eliminar logo

4. **Estilos de QR**
   - Cuadrados (clásico)
   - Puntos (moderno)
   - Redondeado (suave)

5. **Nivel de Corrección de Errores**
   - L (Bajo - 7%)
   - M (Medio - 15%)
   - Q (Alto - 25%)
   - H (Muy Alto - 30%)

6. **Preview en Tiempo Real**
   - Canvas que se actualiza automáticamente
   - Vista previa de 400x400px

7. **Descarga**
   - Botón para descargar QR en formato PNG
   - Archivo listo para imprimir o usar digitalmente

### Tecnologías Utilizadas

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- QRCode.js
- Canvas API

---

## Cómo Desplegar en Vercel (100% GRATIS)

### Método 1: Despliegue desde GitHub (Recomendado)

#### Paso 1: Crear repositorio en GitHub

```bash
# Navegar al directorio del proyecto
cd qr-generator-app

# Inicializar git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit: QR Generator App"

# Crear repositorio en GitHub.com y luego:
git remote add origin https://github.com/TU_USUARIO/qr-generator.git
git branch -M main
git push -u origin main
```

#### Paso 2: Desplegar en Vercel

1. Ve a [https://vercel.com](https://vercel.com)
2. Haz clic en "Sign Up" o "Login"
3. Conecta tu cuenta de GitHub
4. Haz clic en "New Project"
5. Importa tu repositorio `qr-generator`
6. Vercel detectará automáticamente que es Next.js
7. Haz clic en "Deploy"

**¡Listo!** En 1-2 minutos tendrás tu app en vivo con una URL tipo: `https://qr-generator-xxx.vercel.app`

### Método 2: Despliegue con Vercel CLI

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Login
vercel login

# Deploy (modo preview)
vercel

# Deploy a producción
vercel --prod
```

---

## Prueba Local Antes de Desplegar

```bash
# Desarrollo (con hot reload)
npm run dev

# Abrir en navegador: http://localhost:3000

# Build de producción (para verificar que todo compile)
npm run build

# Ejecutar build de producción localmente
npm start
```

---

## Estructura del Proyecto

```
qr-generator-app/
├── app/
│   ├── page.tsx          # Página principal
│   ├── layout.tsx        # Layout global
│   └── globals.css       # Estilos globales
├── components/
│   └── QRGenerator.tsx   # Componente principal del generador
├── public/               # Archivos estáticos
├── package.json          # Dependencias
├── vercel.json          # Configuración de Vercel
├── README.md            # Documentación
└── tsconfig.json        # Configuración TypeScript
```

---

## Características Avanzadas Futuras (Opcional)

Si quieres expandir la aplicación en el futuro:

- [ ] Plantillas prediseñadas de QR
- [ ] Historial de QR generados (localStorage)
- [ ] Múltiples formatos de descarga (SVG, PDF)
- [ ] Generación en lote
- [ ] Analytics de escaneos (requiere backend)
- [ ] Códigos QR dinámicos (requiere backend)
- [ ] Más estilos personalizados (gradientes, patrones)

---

## Troubleshooting

### Error al construir
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Canvas no funciona
El canvas requiere navegador moderno. Asegúrate de usar Chrome, Firefox, Safari o Edge actualizados.

### Logo no se muestra
- Verifica que la imagen sea PNG, JPG o WEBP
- Mantén el tamaño del archivo bajo 2MB

---

## Costos

### Hosting en Vercel (Plan Hobby - GRATIS)
- ✅ Despliegues ilimitados
- ✅ 100GB de ancho de banda
- ✅ Dominio .vercel.app gratis
- ✅ SSL automático
- ✅ CDN global

### Dominio personalizado (Opcional)
- Aprox. $10-15/año en Namecheap, Google Domains, etc.
- Se puede conectar fácilmente en Vercel

---

## Siguientes Pasos Recomendados

1. **Probar localmente**: `npm run dev`
2. **Subir a GitHub**: Seguir pasos del Método 1
3. **Desplegar en Vercel**: 1 click deploy
4. **Compartir**: Enviar la URL a tus clientes/amigos
5. **(Opcional) Dominio personalizado**: Comprar dominio y conectarlo

---

## Soporte

Si tienes problemas:
1. Revisa los logs en Vercel Dashboard
2. Verifica que todas las dependencias estén instaladas
3. Asegúrate de que el build local funcione primero

---

**¡Tu aplicación está lista para desplegarse! 🚀**
