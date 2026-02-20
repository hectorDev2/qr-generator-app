# Generador de Códigos QR Personalizado

Una aplicación web moderna y gratuita para generar códigos QR personalizados para tu negocio con logo, colores y estilos personalizables. La interfaz ocupa exactamente la ventana del navegador, sin scroll, con un layout compacto y optimizado.

## Características

- **Interfaz sin scroll** - Todo el contenido cabe en la ventana del navegador (100vh), diseño compacto
- **Modo oscuro sin parpadeo** - Tema aplicado antes del primer render para evitar flash
- **Personalización completa de colores** - Elige los colores del módulo y fondo del QR
- **Logo personalizado** - Agrega el logo de tu negocio en el centro del QR
- **Múltiples estilos** - Cuadrados, puntos o redondeado
- **Vista previa en tiempo real** - Renderizado con debounce para mejor rendimiento
- **Exportar en PNG y SVG** - Descarga vectorial o raster en distintos tamaños
- **Validación de URL** - Detecta y valida URLs automáticamente
- **Persistencia local** - La configuración se guarda en `localStorage`
- **Privacidad** - Todo se procesa en el navegador, sin enviar datos a servidores

## Demo

[Ver Demo en Vivo](#) (Añadir link después del deploy)

## Tecnologías Utilizadas

- **Next.js 15** - Framework React para producción
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos modernos y utilitarios
- **Canvas API** - Generación y renderizado manual de módulos QR con colores y estilos precisos

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
