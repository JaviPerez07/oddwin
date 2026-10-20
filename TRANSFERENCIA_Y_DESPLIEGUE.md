# OddWin Studios — transferencia y despliegue

Este paquete contiene el código fuente y los recursos necesarios para ejecutar la web en otro equipo. La web usa Next.js y necesita un alojamiento compatible con Node.js; no basta con subir los archivos a un hosting estático.

## En el nuevo equipo

1. Instala Node.js 20.9 o superior (se recomienda Node 22) y npm.
2. Descomprime `Oddwin_Studios_Web_Transfer.zip`.
3. Entra en la carpeta `oddwin-studios-web` y ejecuta:

   ```bash
   npm ci
   cp .env.example .env.local
   npm run dev
   ```

   La web de desarrollo estará en `http://localhost:3000`.

## Publicación y dominio

Puedes desplegar la carpeta en Vercel o en otro proveedor que ejecute aplicaciones Next.js/Node.js. Configura estas variables en el panel del proveedor antes de compilar:

```text
SITE_ENV=production
NEXT_PUBLIC_SITE_URL=https://TU-DOMINIO
```

Sustituye `TU-DOMINIO` por el dominio definitivo, sin barra al final. Si vas a mostrar un correo de contacto, configura también `NEXT_PUBLIC_CONTACT_EMAIL`.

El comando de compilación es `npm run build`; el servidor de producción se inicia con `npm start` (el proveedor suele encargarse de ambos pasos). Añade el dominio personalizado en el panel del proveedor y aplica en tu registrador o DNS los registros que ese proveedor indique. Activa HTTPS y comprueba la web en el dominio definitivo.

## Qué incluye el ZIP

- Código de páginas, componentes y contenido (`src/`)
- Imágenes, vídeos, logotipo, icono y tipografías (`public/`, `src/fonts/`)
- Archivos de dependencias y configuración de Next.js/TypeScript
- `.env.example` con valores de ejemplo, sin claves ni secretos
- Documentación del proyecto y del registro de assets

El ZIP omite `node_modules`, compilaciones, cachés y archivos locales de Git; `npm ci` reconstruye las dependencias en el equipo destino.

## Estado de afiliaciones

La web se puede desplegar mientras se tramitan las afiliaciones. El paquete no activa ofertas ni enlaces de casino reales: las ofertas de producción siguen vacías. Añade una oferta solo cuando el programa haya aprobado por escrito el dominio y el tráfico, y se hayan verificado los permisos y requisitos del mercado correspondiente.
