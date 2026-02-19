# Generador de Códigos QR Personalizado

Una aplicación web moderna y gratuita para generar códigos QR personalizados para tu negocio con logo, colores y estilos personalizables.

## Características

- ✨ **Interfaz moderna y responsive** - Diseñada con Tailwind CSS
- 🎨 **Personalización completa de colores** - Elige los colores que quieras
- 🖼️ **Logo personalizado** - Agrega el logo de tu negocio en el centro del QR
- 🎯 **Múltiples estilos** - Cuadrados, puntos o redondeado
- 📱 **Vista previa en tiempo real** - Ve los cambios instantáneamente
- ⬇️ **Descarga instantánea** - Descarga tu QR en formato PNG
- 🌓 **Modo oscuro** - Soporte para tema claro y oscuro
- 🔒 **Privacidad** - Todo se procesa en tu navegador, sin enviar datos a servidores

## Demo

[Ver Demo en Vivo](#) (Añadir link después del deploy)

## Tecnologías Utilizadas

- **Next.js 16** - Framework React para producción
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos modernos
- **QRCode.js** - Generación de códigos QR
- **Canvas API** - Manipulación de imágenes

## Instalación Local

```bash
# Clonar el repositorio
git clone <tu-repo>

# Navegar al directorio
cd qr-generator-app

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Despliegue en Vercel (GRATIS)

### Opción 1: Deploy desde GitHub

1. Crea un repositorio en GitHub y sube el código:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <tu-repo-url>
git push -u origin main
```

2. Ve a [Vercel](https://vercel.com) y crea una cuenta gratuita

3. Click en "New Project"

4. Importa tu repositorio de GitHub

5. Vercel detectará automáticamente que es un proyecto Next.js

6. Click en "Deploy"

¡Listo! Tu aplicación estará disponible en una URL pública en menos de 1 minuto.

### Opción 2: Deploy con Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login en Vercel
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

## Uso

1. **Ingresa tu URL o texto** - El contenido que quieres que el QR code contenga
2. **Personaliza los colores** - Usa los selectores de color o ingresa códigos hex
3. **Selecciona un estilo** - Cuadrados, puntos o redondeado
4. **Sube tu logo** (opcional) - Agrega el logo de tu negocio
5. **Ajusta el nivel de corrección** - Mayor corrección permite más daño al QR pero lo hace más grande
6. **Descarga** - Click en el botón de descarga para obtener tu QR en PNG

## Configuración Avanzada

### Niveles de Corrección de Errores

- **L (Bajo)**: 7% - Más rápido, QR más pequeño
- **M (Medio)**: 15% - Balance recomendado
- **Q (Alto)**: 25% - Mejor para QR con logos
- **H (Muy Alto)**: 30% - Máxima resistencia a daños

### Consejos para Mejores Resultados

- Usa un logo con fondo transparente (PNG)
- Asegura buen contraste entre colores principal y de fondo
- Prueba tu QR code antes de imprimirlo
- Para logos grandes, usa nivel de corrección H

## Contribuir

Las contribuciones son bienvenidas! Si tienes ideas para mejorar la aplicación:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es de código abierto y gratuito para uso personal y comercial.

## Soporte

Si tienes preguntas o encuentras algún problema, abre un issue en GitHub.

---

Hecho con ❤️ para la comunidad
